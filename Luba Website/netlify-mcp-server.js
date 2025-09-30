#!/usr/bin/env node
// Simple Netlify MCP Server Wrapper

const NETLIFY_TOKEN = process.env.NETLIFY_AUTH_TOKEN || 'nfp_x4kuLcrQRpzWXb3XfopEr1VqmJzZ6Uz3da43';

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');

class NetlifyMCPServer {
    constructor() {
        this.server = new Server({
            name: 'netlify-mcp',
            version: '1.0.0'
        }, {
            capabilities: {
                tools: {}
            }
        });

        this.setupHandlers();
    }

    setupHandlers() {
        this.server.setRequestHandler('tools/list', async () => ({
            tools: [
                {
                    name: 'list_sites',
                    description: 'List all Netlify sites',
                    inputSchema: {
                        type: 'object',
                        properties: {}
                    }
                },
                {
                    name: 'deploy_site',
                    description: 'Deploy files to Netlify site',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            site_id: { type: 'string' },
                            directory: { type: 'string' }
                        },
                        required: ['site_id', 'directory']
                    }
                }
            ]
        }));

        this.server.setRequestHandler('tools/call', async (request) => {
            const { name, arguments: args } = request.params;

            switch(name) {
                case 'list_sites':
                    return await this.listSites();
                case 'deploy_site':
                    return await this.deploySite(args.site_id, args.directory);
                default:
                    throw new Error(`Unknown tool: ${name}`);
            }
        });
    }

    async listSites() {
        const response = await fetch('https://api.netlify.com/api/v1/sites', {
            headers: {
                'Authorization': `Bearer ${NETLIFY_TOKEN}`
            }
        });
        const sites = await response.json();
        return {
            content: [{
                type: 'text',
                text: JSON.stringify(sites.map(s => ({
                    id: s.site_id,
                    name: s.name,
                    url: s.url,
                    custom_domain: s.custom_domain
                })), null, 2)
            }]
        };
    }

    async deploySite(siteId, directory) {
        const { execSync } = require('child_process');
        const fs = require('fs');
        
        // Create zip
        const zipFile = `${process.env.TEMP}/deploy_${Date.now()}.zip`;
        execSync(`powershell -Command "Compress-Archive -Path '${directory}/*' -DestinationPath '${zipFile}' -Force"`);
        
        // Upload
        const zipBuffer = fs.readFileSync(zipFile);
        const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NETLIFY_TOKEN}`,
                'Content-Type': 'application/zip'
            },
            body: zipBuffer
        });
        
        const deploy = await response.json();
        fs.unlinkSync(zipFile); // Clean up
        
        return {
            content: [{
                type: 'text',
                text: `Deployed successfully!\nURL: ${deploy.deploy_ssl_url}\nAdmin: ${deploy.admin_url}`
            }]
        };
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Netlify MCP Server running');
    }
}

// Run server
const server = new NetlifyMCPServer();
server.run().catch(console.error);