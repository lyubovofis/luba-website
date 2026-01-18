/**
 * Script to update footers in all /ru/ article files
 * Replaces the old simple footer with the new SEO footer
 */

const fs = require('fs');
const path = require('path');

// Path to the articles directory
const articlesDir = path.join(__dirname, '..', 'ru');

// New SEO footer HTML (inline, without the style tag since we'll add it to head or keep inline)
const newFooterHTML = `<!-- SEO Footer Component - Денежный Водопад -->
<style>
/* SEO Footer Styles */
.seo-footer {
    background: linear-gradient(180deg, #1a1625 0%, #0d0a12 100%);
    color: #e2dfe8;
    padding: 0;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    position: relative;
    overflow: hidden;
}

.seo-footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #6b46c1, #fbbf24, #6b46c1, transparent);
}

.seo-footer-inner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 50px 30px 30px;
}

.seo-footer-articles { margin-bottom: 40px; }

.seo-footer-title {
    text-align: center;
    margin-bottom: 35px;
}

.seo-footer-title h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #fbbf24;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 12px;
}

.seo-footer-title h3::before,
.seo-footer-title h3::after {
    content: '';
    width: 40px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #6b46c1);
}

.seo-footer-title h3::after {
    background: linear-gradient(90deg, #6b46c1, transparent);
}

.seo-categories {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 25px;
}

@media (max-width: 1200px) {
    .seo-categories { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
    .seo-categories { grid-template-columns: repeat(2, 1fr); gap: 20px; }
}

@media (max-width: 480px) {
    .seo-categories { grid-template-columns: 1fr; }
}

.seo-category {
    background: rgba(107, 70, 193, 0.08);
    border-radius: 12px;
    padding: 18px;
    border: 1px solid rgba(107, 70, 193, 0.15);
    transition: all 0.3s ease;
}

.seo-category:hover {
    background: rgba(107, 70, 193, 0.12);
    border-color: rgba(107, 70, 193, 0.3);
}

.seo-category-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(251, 191, 36, 0.2);
}

.seo-category-icon { font-size: 1rem; }

.seo-category-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: #fbbf24;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.seo-category-links {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.seo-category-links a {
    color: #a89fc4;
    text-decoration: none;
    font-size: 0.78rem;
    line-height: 1.4;
    transition: all 0.2s ease;
    display: block;
    padding: 2px 0;
}

.seo-category-links a:hover {
    color: #fff;
    padding-left: 5px;
}

.seo-footer-bottom {
    border-top: 1px solid rgba(107, 70, 193, 0.2);
    padding-top: 30px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 30px;
}

@media (max-width: 768px) {
    .seo-footer-bottom {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 20px;
    }
}

.seo-footer-brand {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.seo-footer-brand-name {
    font-size: 1.2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.seo-footer-brand-tagline {
    font-size: 0.8rem;
    color: #8b82a8;
}

.seo-footer-contact {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.seo-footer-contact a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: rgba(107, 70, 193, 0.2);
    color: #fff;
    text-decoration: none;
    transition: all 0.3s ease;
    font-size: 1.1rem;
}

.seo-footer-contact a:hover { transform: translateY(-3px); }

.seo-footer-contact a.whatsapp:hover {
    background: #25D366;
    box-shadow: 0 5px 20px rgba(37, 211, 102, 0.4);
}

.seo-footer-contact a.telegram:hover {
    background: #0088cc;
    box-shadow: 0 5px 20px rgba(0, 136, 204, 0.4);
}

.seo-footer-contact a.instagram:hover {
    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    box-shadow: 0 5px 20px rgba(225, 48, 108, 0.4);
}

.seo-footer-legal {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
}

@media (max-width: 768px) {
    .seo-footer-legal { align-items: center; }
}

.seo-footer-legal-links {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    justify-content: flex-end;
}

@media (max-width: 768px) {
    .seo-footer-legal-links { justify-content: center; }
}

.seo-footer-legal-links a {
    color: #6b6182;
    text-decoration: none;
    font-size: 0.75rem;
    transition: color 0.2s;
}

.seo-footer-legal-links a:hover { color: #a89fc4; }

.seo-footer-copyright {
    font-size: 0.75rem;
    color: #4a4358;
}
</style>

<footer class="seo-footer">
    <div class="seo-footer-inner">
        <div class="seo-footer-articles">
            <div class="seo-footer-title">
                <h3>Полезные статьи</h3>
            </div>
            <div class="seo-categories">
                <div class="seo-category">
                    <div class="seo-category-header">
                        <span class="seo-category-icon">💰</span>
                        <span class="seo-category-name">Психология денег</span>
                    </div>
                    <div class="seo-category-links">
                        <a href="/ru/psihologiya-deneg.html">Психология денег</a>
                        <a href="/ru/finansovaya-gramotnost.html">Финансовая грамотность</a>
                        <a href="/ru/finansovaya-nezavisimost.html">Финансовая независимость</a>
                        <a href="/ru/finansovaya-trevozhnost.html">Финансовая тревожность</a>
                        <a href="/ru/finansovoe-myshlenie.html">Финансовое мышление</a>
                        <a href="/ru/finansovye-celi.html">Финансовые цели</a>
                        <a href="/ru/finansovyi-uspeh.html">Финансовый успех</a>
                        <a href="/ru/lichnye-finansy.html">Личные финансы</a>
                        <a href="/ru/upravlenie-dengami.html">Управление деньгами</a>
                        <a href="/ru/dengi-zlo.html">Деньги — зло?</a>
                        <a href="/ru/otnoshenie-k-dengam.html">Отношение к деньгам</a>
                        <a href="/ru/kak-polyubit-dengi.html">Как полюбить деньги</a>
                    </div>
                </div>
                <div class="seo-category">
                    <div class="seo-category-header">
                        <span class="seo-category-icon">🚫</span>
                        <span class="seo-category-name">Денежные блоки</span>
                    </div>
                    <div class="seo-category-links">
                        <a href="/ru/denezhnye-bloki.html">Денежные блоки</a>
                        <a href="/ru/denezhnye-bloki-spisok.html">Список денежных блоков</a>
                        <a href="/ru/denezhnye-bloki-v-tele.html">Денежные блоки в теле</a>
                        <a href="/ru/kak-ubrat-denezhnye-bloki.html">Как убрать блоки</a>
                        <a href="/ru/test-na-denezhnye-bloki.html">Тест на блоки</a>
                        <a href="/ru/energeticheskie-bloki.html">Энергетические блоки</a>
                        <a href="/ru/psihologicheskie-bariery.html">Психологические барьеры</a>
                        <a href="/ru/denezhnyj-potolok.html">Денежный потолок</a>
                        <a href="/ru/ogranichivayushie-ubezhdeniya.html">Ограничивающие убеждения</a>
                        <a href="/ru/negativnye-ustanovki.html">Негативные установки</a>
                        <a href="/ru/roditelskie-ustanovki.html">Родительские установки</a>
                    </div>
                </div>
                <div class="seo-category">
                    <div class="seo-category-header">
                        <span class="seo-category-icon">😰</span>
                        <span class="seo-category-name">Страхи</span>
                    </div>
                    <div class="seo-category-links">
                        <a href="/ru/strah-bednosti.html">Страх бедности</a>
                        <a href="/ru/strah-budushego.html">Страх будущего</a>
                        <a href="/ru/strah-kritiki.html">Страх критики</a>
                        <a href="/ru/strah-osuzhdeniya.html">Страх осуждения</a>
                        <a href="/ru/strah-otkaza.html">Страх отказа</a>
                        <a href="/ru/strah-peremen.html">Страх перемен</a>
                        <a href="/ru/strah-tratit-dengi.html">Страх тратить деньги</a>
                        <a href="/ru/strah-uspeha.html">Страх успеха</a>
                    </div>
                </div>
                <div class="seo-category">
                    <div class="seo-category-header">
                        <span class="seo-category-icon">🧠</span>
                        <span class="seo-category-name">Мышление</span>
                    </div>
                    <div class="seo-category-links">
                        <a href="/ru/myshlenie-millionera.html">Мышление миллионера</a>
                        <a href="/ru/myshlenie-rosta.html">Мышление роста</a>
                        <a href="/ru/pozitivnoe-myshlenie.html">Позитивное мышление</a>
                        <a href="/ru/pozitivnye-ubezhdeniya.html">Позитивные убеждения</a>
                        <a href="/ru/sila-mysli.html">Сила мысли</a>
                        <a href="/ru/negativnye-mysli.html">Негативные мысли</a>
                    </div>
                </div>
                <div class="seo-category">
                    <div class="seo-category-header">
                        <span class="seo-category-icon">💜</span>
                        <span class="seo-category-name">Работа с собой</span>
                    </div>
                    <div class="seo-category-links">
                        <a href="/ru/lyubov-k-sebe.html">Любовь к себе</a>
                        <a href="/ru/prinyatie-sebya.html">Принятие себя</a>
                        <a href="/ru/cennost-sebya.html">Ценность себя</a>
                        <a href="/ru/uverennost-v-sebe.html">Уверенность в себе</a>
                        <a href="/ru/samosabotazh.html">Самосаботаж</a>
                        <a href="/ru/sindrom-samozvanca.html">Синдром самозванца</a>
                        <a href="/ru/vnutrennij-kritik.html">Внутренний критик</a>
                        <a href="/ru/emocionalnyj-golod.html">Эмоциональный голод</a>
                        <a href="/ru/chuvstvo-viny-za-dengi.html">Чувство вины за деньги</a>
                        <a href="/ru/depressiya-iz-za-deneg.html">Депрессия из-за денег</a>
                        <a href="/ru/rabota-s-podsoznaniem.html">Работа с подсознанием</a>
                    </div>
                </div>
                <div class="seo-category">
                    <div class="seo-category-header">
                        <span class="seo-category-icon">🌳</span>
                        <span class="seo-category-name">Род и семья</span>
                    </div>
                    <div class="seo-category-links">
                        <a href="/ru/rodovye-programmy.html">Родовые программы</a>
                        <a href="/ru/rodovye-travmy.html">Родовые травмы</a>
                        <a href="/ru/rabota-s-rodom.html">Работа с родом</a>
                        <a href="/ru/semeynye-scenarii.html">Семейные сценарии</a>
                        <a href="/ru/sistemnye-rasstanovki.html">Системные расстановки</a>
                        <a href="/ru/toksichnye-otnosheniya.html">Токсичные отношения</a>
                        <a href="/ru/dengi-i-lyubov.html">Деньги и любовь</a>
                        <a href="/ru/dengi-i-otnosheniya.html">Деньги и отношения</a>
                        <a href="/ru/dengi-v-otnosheniyah.html">Деньги в отношениях</a>
                        <a href="/ru/ssory-iz-za-deneg.html">Ссоры из-за денег</a>
                        <a href="/ru/zhenshina-i-dengi.html">Женщина и деньги</a>
                    </div>
                </div>
                <div class="seo-category">
                    <div class="seo-category-header">
                        <span class="seo-category-icon">✨</span>
                        <span class="seo-category-name">Практики</span>
                    </div>
                    <div class="seo-category-links">
                        <a href="/ru/meditaciya-na-dengi.html">Медитация на деньги</a>
                        <a href="/ru/meditaciya-izobilie.html">Медитация изобилия</a>
                        <a href="/ru/denezhnaya-meditaciya.html">Денежная медитация</a>
                        <a href="/ru/affirmacii-na-dengi.html">Аффирмации на деньги</a>
                        <a href="/ru/mantry-na-dengi.html">Мантры на деньги</a>
                        <a href="/ru/vizualizaciya-deneg.html">Визуализация денег</a>
                        <a href="/ru/vizualizaciya-uspeha.html">Визуализация успеха</a>
                        <a href="/ru/energiya-deneg.html">Энергия денег</a>
                        <a href="/ru/denezhnaya-energiya.html">Денежная энергия</a>
                        <a href="/ru/privlechenie-deneg.html">Привлечение денег</a>
                        <a href="/ru/kak-privlech-dengi.html">Как привлечь деньги</a>
                        <a href="/ru/karma-deneg.html">Карма денег</a>
                    </div>
                </div>
                <div class="seo-category">
                    <div class="seo-category-header">
                        <span class="seo-category-icon">💎</span>
                        <span class="seo-category-name">Доход и богатство</span>
                    </div>
                    <div class="seo-category-links">
                        <a href="/ru/uvelichit-dohod.html">Увеличить доход</a>
                        <a href="/ru/kak-uvelichit-dohod-psihologiya.html">Психология дохода</a>
                        <a href="/ru/dopolnitelnyi-dohod.html">Дополнительный доход</a>
                        <a href="/ru/passivnyi-dohod.html">Пассивный доход</a>
                        <a href="/ru/kak-razbogatet.html">Как разбогатеть</a>
                        <a href="/ru/kak-stat-bogatym.html">Как стать богатым</a>
                        <a href="/ru/kak-stat-millionerom.html">Как стать миллионером</a>
                        <a href="/ru/privychki-bogatyh.html">Привычки богатых</a>
                        <a href="/ru/put-k-bogatstvu.html">Путь к богатству</a>
                        <a href="/ru/pochemu-ne-hvataet-deneg.html">Почему не хватает денег</a>
                        <a href="/ru/kak-kopit-dengi.html">Как копить деньги</a>
                    </div>
                </div>
                <div class="seo-category">
                    <div class="seo-category-header">
                        <span class="seo-category-icon">🛒</span>
                        <span class="seo-category-name">Покупки и траты</span>
                    </div>
                    <div class="seo-category-links">
                        <a href="/ru/shopogolizm.html">Шопоголизм</a>
                        <a href="/ru/impulsivnye-pokupki.html">Импульсивные покупки</a>
                        <a href="/ru/kompulsivnye-pokupki.html">Компульсивные покупки</a>
                        <a href="/ru/emocionalnye-pokupki.html">Эмоциональные покупки</a>
                        <a href="/ru/zavisimost-ot-pokupok.html">Зависимость от покупок</a>
                    </div>
                </div>
                <div class="seo-category">
                    <div class="seo-category-header">
                        <span class="seo-category-icon">🎯</span>
                        <span class="seo-category-name">Коучинг</span>
                    </div>
                    <div class="seo-category-links">
                        <a href="/ru/kouching-onlayn.html">Коучинг онлайн</a>
                        <a href="/ru/konsultaciya-psihologa.html">Консультация психолога</a>
                        <a href="/ru/layf-kouch.html">Лайф коуч</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="seo-footer-bottom">
            <div class="seo-footer-brand">
                <span class="seo-footer-brand-name">Денежный Водопад</span>
                <span class="seo-footer-brand-tagline">Любовь Лукащук • Психолог</span>
            </div>
            <div class="seo-footer-contact">
                <a href="https://wa.me/972539459969" class="whatsapp" title="WhatsApp" aria-label="WhatsApp">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a href="https://t.me/Lyubov_psy" class="telegram" title="Telegram" aria-label="Telegram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                </a>
                <a href="https://www.instagram.com/lyubov_psy_/" class="instagram" title="Instagram" aria-label="Instagram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
            </div>
            <div class="seo-footer-legal">
                <div class="seo-footer-legal-links">
                    <a href="/privacy.html">Конфиденциальность</a>
                    <a href="/terms.html">Условия</a>
                    <a href="/disclaimer.html">Отказ от ответственности</a>
                    <a href="/cookie-policy.html">Cookies</a>
                </div>
                <span class="seo-footer-copyright">© 2026 ФОП Лукащук Любов. Все права защищены.</span>
            </div>
        </div>
    </div>
</footer>`;

// Pattern to match existing footer (various formats)
const footerPatterns = [
    // Pattern 1: <!-- Footer --> comment followed by footer tag
    /<!--\s*Footer\s*-->\s*<footer[\s\S]*?<\/footer>/gi,
    // Pattern 2: Just footer tag with simple content
    /<footer>[\s\S]*?<\/footer>/gi,
    // Pattern 3: footer with class or style
    /<footer[^>]*>[\s\S]*?<\/footer>/gi
];

function updateFooter(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;

        // Try each pattern
        for (const pattern of footerPatterns) {
            if (pattern.test(content)) {
                content = content.replace(pattern, newFooterHTML);
                updated = true;
                break;
            }
        }

        if (updated) {
            fs.writeFileSync(filePath, content, 'utf8');
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

function main() {
    console.log('Starting footer update...\n');

    // Get all HTML files in /ru/ directory
    const files = fs.readdirSync(articlesDir)
        .filter(file => file.endsWith('.html'))
        .map(file => path.join(articlesDir, file));

    let successCount = 0;
    let failCount = 0;

    files.forEach(file => {
        const result = updateFooter(file);
        const fileName = path.basename(file);

        if (result) {
            console.log(`✓ Updated: ${fileName}`);
            successCount++;
        } else {
            console.log(`✗ Failed: ${fileName}`);
            failCount++;
        }
    });

    console.log(`\n========================================`);
    console.log(`Total files processed: ${files.length}`);
    console.log(`Successfully updated: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`========================================`);
}

main();
