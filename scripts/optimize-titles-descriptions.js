/**
 * CTR-optimized titles and descriptions.
 * Research: brackets []+40% CTR, numbers+36%, optimal 40-60 chars, desc 140-155 chars.
 * Formula: [Keyword]: [Number] + [Benefit] [Tag] | max 60 chars
 * Desc: [Конкретная польза с числом] + [Соцдоказательство] + [CTA]
 */

const fs = require('fs');
const path = require('path');
const RU = 'C:\\Luba Website\\ru';

// Map: filename → { title, desc }
// desc: null means keep existing (not too long)
const updates = {
  'affirmacii-na-dengi.html': {
    title: 'Аффирмации на деньги: 7 ошибок [Полный гайд]',
    desc: 'Почему аффирмации на деньги не работают? 7 ошибок + как исправить. Психолог 10+ лет, 1000+ трансформаций. Первая консультация — бесплатно.',
  },
  'chuvstvo-viny-za-dengi.html': {
    title: 'Чувство вины за деньги: как избавиться [Тест]',
    desc: 'Чувство вины за деньги блокирует доход. 5 причин + тест. Психолог с 10-летним опытом поможет освободиться навсегда. Первая консультация — бесплатно.',
  },
  'denezhnaya-meditaciya.html': {
    title: 'Денежная медитация: 5 техник изобилия [Гайд]',
    desc: null,
  },
  'denezhnye-bloki-spisok.html': {
    title: 'Денежные блоки: список 50+ убеждений [Чек-лист]',
    desc: '50+ денежных убеждений в 7 категориях: найдите свои блоки за 5 минут. Примеры фраз + техники трансформации. Скачайте чек-лист бесплатно.',
  },
  'denezhnye-bloki-v-tele.html': {
    title: 'Денежные блоки в теле: где хранятся и как снять',
    desc: null,
  },
  'denezhnyj-potolok.html': {
    title: 'Денежный потолок: как пробить лимит дохода [Тест]',
    desc: null,
  },
  'dengi-i-lyubov.html': {
    title: 'Деньги и любовь: как финансы разрушают пары',
    desc: null,
  },
  'dengi-i-otnosheniya.html': {
    title: 'Деньги и отношения: конфликты и решения [Тест]',
    desc: 'Деньги и конфликты в паре: почему возникают и как решить. Детские установки влияют на финансы сегодня. Онлайн-консультация психолога — бесплатно.',
  },
  'dengi-v-otnosheniyah.html': {
    title: 'Деньги в отношениях: как говорить без конфликтов',
    desc: null,
  },
  'dengi-zlo.html': {
    title: 'Деньги — зло? Откуда установка и как от неё уйти',
    desc: null,
  },
  'depressiya-iz-za-deneg.html': {
    title: 'Депрессия из-за денег: 7 шагов выхода [Гайд]',
    desc: null,
  },
  'dopolnitelnyi-dohod.html': {
    title: 'Дополнительный доход: почему не получается [Тест]',
    desc: null,
  },
  'emocionalnye-pokupki.html': {
    title: 'Эмоциональные покупки: причины и как остановиться',
    desc: null,
  },
  'emocionalnyj-golod.html': {
    title: 'Эмоциональный голод: как отличить от физического',
    desc: 'Едите не от голода? 5 признаков эмоционального голода и как остановить заедание. Психолог 10+ лет опыта. Первая консультация — бесплатно.',
  },
  'energeticheskie-bloki.html': {
    title: 'Энергетические блоки на деньги: как убрать [Тест]',
    desc: null,
  },
  'energiya-deneg.html': {
    title: 'Энергия денег: правда о вибрациях [Психолог]',
    desc: 'Энергия денег — это психология, не эзотерика. Тест + 5 утечек, которые крадут ваш доход. Психолог с 10-летним опытом. Разберёмся вместе, бесплатно.',
  },
  'finansovaya-nezavisimost.html': {
    title: 'Финансовая независимость: 5 барьеров и как убрать',
    desc: null,
  },
  'finansovaya-trevozhnost.html': {
    title: 'Финансовая тревожность: как перестать бояться [Тест]',
    desc: null,
  },
  'finansovoe-myshlenie.html': {
    title: 'Финансовое мышление: 10 принципов богатых людей',
    desc: null,
  },
  'finansovyi-uspeh.html': {
    title: 'Финансовый успех: почему 90% не достигают цели',
    desc: null,
  },
  'impulsivnye-pokupki.html': {
    title: 'Импульсивные покупки: причины и лечение [Тест]',
    desc: null,
  },
  'kak-kopit-dengi.html': {
    title: 'Как копить деньги: 7 психологических блоков [Тест]',
    desc: null,
  },
  'kak-polyubit-dengi.html': {
    title: 'Как полюбить деньги: 7 шагов к финансовой свободе',
    desc: null,
  },
  'kak-razbogatet.html': {
    title: 'Как разбогатеть: 12 блоков, которые мешают [Тест]',
    desc: '12 скрытых блоков богатства: почему знаете «как», но не богатеете. Тест + разбор. Психолог 10+ лет, 1000+ клиентов. Консультация — бесплатно.',
  },
  'kak-stat-bogatym.html': {
    title: 'Как стать богатым: что реально мешает [Психолог]',
    desc: null,
  },
  'kak-stat-millionerom.html': {
    title: 'Как стать миллионером: мышление и психология [Тест]',
    desc: 'Психологические секреты миллионеров: мышление и привычки богатых. Тест на денежное мышление. 10+ лет опыта, 1000+ трансформаций. Первая сессия — бесплатно.',
  },
  'kak-ubrat-denezhnye-bloki.html': {
    title: null,
    desc: '10 техник убрать денежные блоки самостоятельно: тело, аффирмации, расстановки. Пошаговый план на 8 недель. Психолог 10+ лет. Консультация — бесплатно.',
  },
  'kak-uvelichit-dohod-psihologiya.html': {
    title: 'Как увеличить доход: психология роста [7 техник]',
    desc: null,
  },
  'karma-deneg.html': {
    title: null,
    desc: 'Карма денег — это паттерны из прошлого. Как они влияют на финансы и как изменить судьбу. Психолог 10+ лет, 1000+ клиентов. Консультация — бесплатно.',
  },
  'konsultaciya-psihologa.html': {
    title: 'Консультация психолога онлайн по деньгам [Запись]',
    desc: 'Консультация психолога по деньгам онлайн: разбор вашей ситуации. 10+ лет, 8000+ часов практики. WhatsApp/Telegram. Первая встреча — бесплатно.',
  },
  'kouching-onlayn.html': {
    title: 'Коучинг онлайн: трансформация денежного мышления',
    desc: null,
  },
  'lyubov-k-sebe.html': {
    title: 'Любовь к себе: почему это ключ к деньгам [Тест]',
    desc: null,
  },
  'mantry-na-dengi.html': {
    title: 'Мантры на деньги: 10 текстов для привлечения',
    desc: '10 мантр на деньги с текстами и переводом. Как правильно читать + психология денежных мантр. Работают только с проработкой блоков. Консультация — бесплатно.',
  },
  'meditaciya-na-dengi.html': {
    title: 'Медитация на деньги: почему не работает [Гайд]',
    desc: null,
  },
  'myshlenie-millionera.html': {
    title: null,
    desc: '10 принципов мышления миллионера: что отличает богатых. Тест на финансовое мышление + упражнения. Психолог 10+ лет. Первая консультация — бесплатно.',
  },
  'myshlenie-rosta.html': {
    title: 'Мышление роста (Growth Mindset): как развить [Тест]',
    desc: null,
  },
  'negativnye-ustanovki.html': {
    title: 'Негативные установки про деньги: как убрать [Тест]',
    desc: 'Список негативных установок о деньгах: найдите свои + техники перепрограммирования. Психолог 10+ лет, 1000+ клиентов. Консультация — бесплатно.',
  },
  'ogranichivayushie-ubezhdeniya.html': {
    title: 'Ограничивающие убеждения о деньгах: список + тест',
    desc: null,
  },
  'otnoshenie-k-dengam.html': {
    title: 'Отношение к деньгам: как эмоции влияют на доход',
    desc: null,
  },
  'pochemu-ne-hvataet-deneg.html': {
    title: null,
    desc: 'Почему всегда не хватает денег? Ментальность дефицита, скрытые траты и «дыры». Психолог 10+ лет разберёт вашу ситуацию. Консультация — бесплатно.',
  },
  'pozitivnoe-myshlenie.html': {
    title: 'Позитивное мышление и деньги: как это работает [Тест]',
    desc: null,
  },
  'pozitivnye-ubezhdeniya.html': {
    title: 'Позитивные убеждения про деньги: 50+ установок',
    desc: '50+ позитивных убеждений о деньгах для богатого мышления. Аффирмации + техники внедрения. Психолог 10+ лет. Первая консультация — бесплатно.',
  },
  'prinyatie-sebya.html': {
    title: 'Принятие себя и деньги: как самоценность влияет',
    desc: null,
  },
  'psihologiya-deneg.html': {
    title: 'Психология денег: как изменить отношение [Гайд]',
    desc: null,
  },
  'put-k-bogatstvu.html': {
    title: 'Путь к богатству: 7 этапов от нуля [Чек-лист]',
    desc: null,
  },
  'rabota-s-podsoznaniem.html': {
    title: 'Работа с подсознанием для денег: 5 техник',
    desc: null,
  },
  'roditelskie-ustanovki.html': {
    title: 'Родительские установки про деньги: как убрать [Тест]',
    desc: 'Фразы родителей, которые блокируют доход сейчас. Список + техники освобождения. Психолог 10+ лет, 1000+ трансформаций. Консультация — бесплатно.',
  },
  'rodovye-programmy.html': {
    title: 'Родовые программы и деньги: 7 сценариев [Тест]',
    desc: null,
  },
  'rodovye-travmy.html': {
    title: 'Родовые травмы и деньги: как история семьи влияет',
    desc: 'Как история семьи влияет на ваши финансы? Война, голод, репрессии в роду = блоки дохода. Тест + разбор. Психолог 10+ лет. Консультация — бесплатно.',
  },
  'samosabotazh.html': {
    title: 'Самосаботаж: 8 видов + как остановить [Тест]',
    desc: 'Самосаботаж: 8 видов поведения + тест. Как блокирует деньги и успех. Практические способы избавления. Психолог 10+ лет. Консультация — бесплатно.',
  },
  'semeynye-scenarii.html': {
    title: 'Семейные сценарии и деньги: как изменить [Тест]',
    desc: null,
  },
  'shopogolizm.html': {
    title: 'Шопоголизм: как избавиться от зависимости [Тест]',
    desc: null,
  },
  'sindrom-samozvanca.html': {
    title: null,
    desc: 'Синдром самозванца: 5 типов + как избавиться навсегда. Почему вы обесцениваете себя и теряете деньги. Психолог 10+ лет. Первая консультация — бесплатно.',
  },
  'sistemnye-rasstanovki.html': {
    title: 'Системные расстановки и деньги: честный разбор',
    desc: null,
  },
  'ssory-iz-za-deneg.html': {
    title: 'Ссоры из-за денег: причины и как прекратить [Тест]',
    desc: null,
  },
  'strah-bednosti.html': {
    title: 'Страх бедности: как избавиться навсегда [Тест]',
    desc: null,
  },
  'strah-kritiki.html': {
    title: 'Страх критики: как перестать бояться мнения [Тест]',
    desc: null,
  },
  'strah-osuzhdeniya.html': {
    title: 'Страх осуждения: как перестать бояться [Психолог]',
    desc: null,
  },
  'strah-tratit-dengi.html': {
    title: 'Страх тратить деньги: скупость или блок [Тест]',
    desc: 'Страх тратить деньги — это блок, а не бережливость. 8000+ часов опыта. Менталитет бедности можно изменить за 8 недель. Консультация — бесплатно.',
  },
  'strah-uspeha.html': {
    title: null,
    desc: 'Страх успеха есть у 20% людей. 7 причин + тест + 7 техник преодоления. Психолог 10+ лет. Узнайте свой паттерн, первая консультация — бесплатно.',
  },
  'test-na-denezhnye-bloki.html': {
    title: 'Тест на денежные блоки: бесплатно за 5 минут',
    desc: null,
  },
  'toksichnye-otnosheniya.html': {
    title: 'Токсичные отношения: признаки и выход [Психолог]',
    desc: null,
  },
  'uvelichit-dohod.html': {
    title: 'Как увеличить доход: 7 психологических техник',
    desc: null,
  },
  'uverennost-v-sebe.html': {
    title: 'Уверенность в себе и деньги: как это связано [Тест]',
    desc: null,
  },
  'vizualizaciya-deneg.html': {
    title: 'Визуализация денег: 5 техник изобилия [Гайд]',
    desc: null,
  },
  'vizualizaciya-uspeha.html': {
    title: 'Визуализация успеха: как правильно ставить цели',
    desc: null,
  },
  'vnutrennij-kritik.html': {
    title: 'Внутренний критик: как укротить голос [Психолог]',
    desc: null,
  },
  'zavisimost-ot-pokupok.html': {
    title: 'Зависимость от покупок: лечение и психология [Тест]',
    desc: null,
  },
  'zhenshina-i-dengi.html': {
    title: 'Женщина и деньги: как выстроить отношения [Тест]',
    desc: null,
  },
};

function escapeHtmlAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

let updated = 0;
for (const [filename, { title, desc }] of Object.entries(updates)) {
  const filePath = path.join(RU, filename);
  if (!fs.existsSync(filePath)) {
    console.log('SKIP (not found):', filename);
    continue;
  }

  let c = fs.readFileSync(filePath, 'utf8');
  const original = c;

  if (title) {
    // Update <title>
    c = c.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
    // Update <meta name="title"> if present
    c = c.replace(
      /<meta\s+name="title"\s+content="[^"]*"/i,
      `<meta name="title" content="${escapeHtmlAttr(title)}"`
    );
    // Update og:title
    c = c.replace(
      /<meta\s+property="og:title"\s+content="[^"]*"/i,
      `<meta property="og:title" content="${escapeHtmlAttr(title)}"`
    );
    // Update twitter:title
    c = c.replace(
      /<meta\s+property="twitter:title"\s+content="[^"]*"/i,
      `<meta property="twitter:title" content="${escapeHtmlAttr(title)}"`
    );
  }

  if (desc) {
    // Update <meta name="description">
    c = c.replace(
      /<meta\s+name="description"\s+content="[^"]*"/i,
      `<meta name="description" content="${escapeHtmlAttr(desc)}"`
    );
    // Update og:description
    c = c.replace(
      /<meta\s+property="og:description"\s+content="[^"]*"/i,
      `<meta property="og:description" content="${escapeHtmlAttr(desc)}"`
    );
    // Update twitter:description
    c = c.replace(
      /<meta\s+property="twitter:description"\s+content="[^"]*"/i,
      `<meta property="twitter:description" content="${escapeHtmlAttr(desc)}"`
    );
  }

  if (c !== original) {
    fs.writeFileSync(filePath, c, 'utf8');
    console.log(`UPDATED: ${filename}`);
    if (title) console.log(`  title (${title.length}): ${title}`);
    if (desc) console.log(`  desc  (${desc.length}): ${desc.substring(0, 80)}...`);
    updated++;
  }
}

console.log(`\nDone. Updated: ${updated} files`);
