const fallbackRows = [
  ['推进之王','Siege','先锋',6],['风笛','Bagpipe','先锋',6],['焰尾','Saileach','先锋',6],['伊内丝','Ines','先锋',6],['德克萨斯','Texas','先锋',5],['桃金娘','Myrtle','先锋',4],
  ['银灰','SilverAsh','近卫',6],['陈','Ch’en','近卫',6],['棘刺','Thorns','近卫',6],['史尔特尔','Surtr','近卫',6],['玛恩纳','Młynar','近卫',6],['山','Mountain','近卫',6],['拉普兰德','Lappland','近卫',5],
  ['星熊','Hoshiguma','重装',6],['塞雷娅','Saria','重装',6],['年','Nian','重装',6],['泥岩','Mudrock','重装',6],['号角','Horn','重装',6],
  ['能天使','Exusiai','狙击',6],['W','W','狙击',6],['迷迭香','Rosmontis','狙击',6],['假日威龙陈','Ch’en the Holungday','狙击',6],['黑','Schwarz','狙击',6],['蓝毒','Blue Poison','狙击',5],['克洛丝','Kroos','狙击',3],
  ['艾雅法拉','Eyjafjalla','术师',6],['伊芙利特','Ifrit','术师',6],['夕','Dusk','术师',6],['逻各斯','Logos','术师',6],['澄闪','Goldenglow','术师',6],['阿米娅','Amiya','术师',5],
  ['闪灵','Shining','医疗',6],['夜莺','Nightingale','医疗',6],['凯尔希','Kal’tsit','医疗',6],['焰影苇草','Reed the Flame Shadow','医疗',6],['白面鸮','Ptilopsis','医疗',5],['苏苏洛','Sussurro','医疗',4],
  ['安洁莉娜','Angelina','辅助',6],['铃兰','Suzuran','辅助',6],['浊心斯卡蒂','Skadi the Corrupting Heart','辅助',6],['灵知','Gnosis','辅助',6],['初雪','Pramanix','辅助',5],['梓兰','Orchid','辅助',3],
  ['傀影','Phantom','特种',6],['归溟幽灵鲨','Specter the Unchained','特种',6],['阿','Aak','特种',6],['温蒂','Weedy','特种',6],['麒麟R夜刀','Yato the Atılgan','特种',6],['槐琥','Waai Fu','特种',5],['红','Projekt Red','特种',5],
].map(([name,en,profession,rarity])=>({name,en,profession,rarity,position:(['先锋','近卫','重装'].includes(profession)||(['特种'].includes(profession)&&name!=='阿'))?'近战位':'远程位',tagList:[],personality:[]}));

const fallbackPortraitIds={'推进之王':'char_009_12fce','风笛':'char_222_bpipe','德克萨斯':'char_102_texas','桃金娘':'char_151_myrtle','银灰':'char_017_huang','陈':'char_010_chen','棘刺':'char_293_thorns','史尔特尔':'char_350_surtr','玛恩纳':'char_4062_mlynar','山':'char_264_f12','星熊':'char_136_hsguma','塞雷娅':'char_202_demkni','泥岩':'char_311_mudrock','能天使':'char_103_angel','W':'char_113_cqbw','黑':'char_340_shwaz','艾雅法拉':'char_180_amgoat','伊芙利特':'char_134_ifrit','阿米娅':'char_002_amiya','凯尔希':'char_003_kalts','安洁莉娜':'char_291_aglina','铃兰':'char_358_lisa','傀影':'char_250_phantom','阿':'char_225_haak','温蒂':'char_400_weedy'};
fallbackRows.forEach((operator)=>{operator.id=fallbackPortraitIds[operator.name]||'';});

// Personality clues are a separate, explicitly curated layer. Each entry points to the PRTS
// operator archive used for the summary; no personality clue is synthesized from job/rarity.
const personalityNotes = {
  '风笛':{tags:['开朗','热情','直率'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/风笛'},
  '德克萨斯':{tags:['寡言','冷静','克制'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/德克萨斯'},
  '桃金娘':{tags:['活泼','乐观','直率'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/桃金娘'},
  '银灰':{tags:['自信','果断','谋略'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/银灰'},
  '陈':{tags:['严厉','恪尽职守','坚毅'],evidence:'PRTS 干员档案·资料二、未获得时档案',url:'https://prts.wiki/w/陈晖洁'},
  '棘刺':{tags:['冷静','理性','专注'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/棘刺'},
  '玛恩纳':{tags:['克制','认真','责任感'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/玛恩纳'},
  '星熊':{tags:['豪爽','可靠','沉稳'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/星熊'},
  '能天使':{tags:['开朗','乐观','健谈'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/能天使'},
  'W':{tags:['狡黠','警惕','不羁'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/W'},
  '蓝毒':{tags:['温和','谨慎','体贴'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/蓝毒'},
  '艾雅法拉':{tags:['温和','专注','勤勉'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/艾雅法拉'},
  '伊芙利特':{tags:['直率','冲动','好奇'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/伊芙利特'},
  '阿米娅':{tags:['温柔','坚定','责任感'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/阿米娅'},
  '凯尔希':{tags:['冷静','严谨','寡言'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/凯尔希'},
  '白面鸮':{tags:['理性','认真','直接'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/白面鸮'},
  '安洁莉娜':{tags:['温柔','乐观','坚韧'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/安洁莉娜'},
  '铃兰':{tags:['温和','坚强','体贴'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/铃兰'},
  '浊心斯卡蒂':{tags:['沉静','疏离','克制'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/浊心斯卡蒂'},
  '傀影':{tags:['孤僻','敏感','克制'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/傀影'},
  '阿':{tags:['活泼','自信','顽皮'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/阿'},
  '推进之王':{tags:['沉稳','寡言','重视责任'],evidence:'PRTS 干员档案与语音记录',url:'https://prts.wiki/w/推进之王'},
  '梓兰':{tags:['常识丰富','有责任心','照顾他人'],evidence:'档案资料：常识水平顶尖；队长更像是他们的保姆',url:'https://prts.wiki/w/梓兰'},
  '远山':{tags:['容易紧张','好胜','狡黠'],evidence:'档案资料：玩牌时容易紧张且求胜心极强；被抓现行前绝不承认出千',url:'https://prts.wiki/w/远山'},
  '卡达':{tags:['谨慎','对大型菲林有戒心'],evidence:'档案资料：拍摄前会做好万全准备，绝不贸然前往；会躲避体型强大的菲林',url:'https://prts.wiki/w/卡达'},
  '红云':{tags:['坚韧','复仇心强'],evidence:'档案资料：失去手臂后快速恢复并适应义肢；持续追查仇敌',url:'https://prts.wiki/w/红云'},
  '安比尔':{tags:['低调'],evidence:'档案资料：为人低调，工作完成基本不出岔子',url:'https://prts.wiki/w/安比尔'},
  '刻刀':{tags:['平和','偶尔迷糊','有原则'],evidence:'档案资料：日常表现淡然平和、偶尔迷糊；为自己定下不可违背的行为规则',url:'https://prts.wiki/w/刻刀'},
  '宴':{tags:['豁达','爱玩'],evidence:'档案资料：对矿石病看得开，仍如患病前那样生活；爱吃、爱玩、喜欢追逐时尚',url:'https://prts.wiki/w/宴'},
  '暗索':{tags:['轻佻','笑脸迎人','与人保持距离'],evidence:'档案资料：轻佻的小贼；对谁都笑脸相迎，却让人感到距离感',url:'https://prts.wiki/w/暗索'},
  '嘉维尔':{tags:['直爽','尽职','乐于助人'],evidence:'档案资料：为人直爽、十分尽职；选择以救死扶伤为己任',url:'https://prts.wiki/w/嘉维尔'},
  '地灵':{tags:['专注','敬业','重视规划'],evidence:'档案资料：研究岩石时全神贯注；重视作息规划并坚持准时下班',url:'https://prts.wiki/w/地灵'},
  '齐尔查克':{tags:['严肃','重视专业界限'],evidence:'档案资料：工作中非常严肃，不喜欢别人介入他的专业领域',url:'https://prts.wiki/w/齐尔查克'},
  '鞭刃':{tags:['有威严','不难相处'],evidence:'档案资料：初见时显得盛气凌人；克服第一印象后并不难相处',url:'https://prts.wiki/w/鞭刃'},
  '星极':{tags:['乐于助人','善于开导'],evidence:'档案资料：会开导对未来抱有疑惑的莱茵生命同事',url:'https://prts.wiki/w/星极'},
  '赤冬':{tags:['作风老派','忠诚'],evidence:'档案资料：生活习惯相当老派；只信任并愿意追随一位长辈',url:'https://prts.wiki/w/赤冬'},
  '梅尔':{tags:['富有创造力','勤奋','珍视伙伴'],evidence:'档案资料：脑中总有各种点子，字典里没有“无所事事”；会精心制作铭牌并妥善处理咪波残骸',url:'https://prts.wiki/w/梅尔'},
  '华法琳':{tags:['有忍耐力','要求严格','行事随性'],evidence:'档案资料：治疗时要求病人听从指令；能克制对血液的喜好，不惊吓病人；想到点子就会立刻实践',url:'https://prts.wiki/w/华法琳'},
  '明椒':{tags:['直爽','做事利落'],evidence:'档案资料：性格直爽，说话做事明快利落',url:'https://prts.wiki/w/明椒'},
  '临光':{tags:['品行高尚','重视同伴','乐于助人'],evidence:'档案资料：以援助感染者为己任；将自己视为队友的盾与避难所',url:'https://prts.wiki/w/临光'},
  '初雪':{tags:['能忍耐','渴望卸下重担'],evidence:'档案资料：承担大量圣女事务；独处时会卸下重担，回归织物、茶与阅读',url:'https://prts.wiki/w/初雪'},
  '水灯心':{tags:['快乐','朴素','乐于分享'],evidence:'档案资料：给人的第一印象是快乐、简单而匆忙；愿意将自己的心火分享给他人',url:'https://prts.wiki/w/水灯心'},
  '霍尔海雅':{tags:['善于隐藏情绪','独立行动','善于观察'],evidence:'档案资料：独立任务几乎全数申请；以玩味表情观察干员名单，了解他人顾虑',url:'https://prts.wiki/w/霍尔海雅'},
  '弑君者':{tags:['嘴硬','逞强','重视羁绊'],evidence:'档案资料：嘴上说得凶，实际想从凯尔希处得到答案；档案评价她有时会逞能',url:'https://prts.wiki/w/弑君者'},
  '斥罪':{tags:['严肃','善于理解','善于协作'],evidence:'档案资料：被描述为严肃的法官；能理解罗德岛业务目的，并与同事默契协作',url:'https://prts.wiki/w/斥罪'},
  '斩业星熊':{tags:['严肃','幽默','正直'],evidence:'档案资料：对时弊发表明确意见；会打趣朋友，也会用和善态度制止无理行为',url:'https://prts.wiki/w/斩业星熊'},
  '史尔特尔':{tags:['随性','不执着于结果'],evidence:'档案资料：自由生活，不在意记忆能否全部寻回；对她而言过程可能比结果重要',url:'https://prts.wiki/w/史尔特尔'},
  '赫拉格':{tags:['深谋远虑','谨慎','守口如瓶'],evidence:'档案资料：被评价为高瞻远瞩；在找到决定性证据前不透露更多，始终守护诊所秘密',url:'https://prts.wiki/w/赫拉格'},
  '波登可':{tags:['有冲劲','热爱植物','向往外界'],evidence:'档案资料：凭着一股冲劲学习新领域；从小喜爱植物，并一直向往外面的世界',url:'https://prts.wiki/w/波登可'},
  '车尔尼':{tags:['专注','向往远方'],evidence:'档案资料：对宴会没有兴趣，注意力大多放在乐谱上；加入罗德岛后渴望探索更广阔的大地',url:'https://prts.wiki/w/车尔尼'},
};
Object.entries(personalityNotes).forEach(([name,note])=>{const operator=fallbackRows.find((item)=>item.name===name);if(operator)operator.personality=note.tags.map((text)=>({text,source:'personality',evidence:note.evidence,url:note.url}));});

const classCodes={PIONEER:'先锋',WARRIOR:'近卫',TANK:'重装',SNIPER:'狙击',CASTER:'术师',MEDIC:'医疗',SUPPORT:'辅助',SPECIAL:'特种'};
function normalizeRarity(value){if(Number.isInteger(value))return value+1;const match=String(value??'').match(/(?:TIER_)?(\d+)/);return match?Number(match[1]):0;}
const classMarks={先锋:'V',近卫:'✣',重装:'▰',狙击:'⌖',术师:'✳',医疗:'+',辅助:'◇',特种:'⌁'};
const personalityLexicon=[
  '冷静','理性','寡言','谨慎','温和','温柔','坚强','坚定','开朗','活泼','乐观','热情','直率','严厉','严谨','认真','自信','果断','孤僻','沉默','害羞','腼腆','天真','善良','豪爽','沉稳','自律','冷淡','敏感','顽皮','好奇','积极','倔强','执着','坚毅','可靠','狡黠','不羁','慷慨','勤勉','热心','羞涩','坦率','沉着',
  '消极','嗜睡','内向','踏实','老实','安静','听话','麻烦制造者','诚恳','心思单纯','单纯','容易被骗','大大咧咧','偷盗癖','不苟言笑','难以捉摸','捉摸不透','不信任','独自行动','难以沟通','不着调','容易脸红','呆板','温顺','面冷心热','有礼貌','莽撞','叛逆','盲目自大','暴躁','洁癖','率直','不拘小节','嬉皮笑脸','性格恶劣','无法无天','单细胞生物','自由自在','无忧无虑','偏执','节约精神','耐心','固执','亲和力','真诚','怕生','傲慢','好胜','神出鬼没','胆小','严肃','自嘲','性格非常好','盛气凌人','说话不客气'
];
const profileTags=[
  ['position','部署位置'],['gender','性别'],['race','种族'],['nation','出身地'],['birthday','生日']
];
let operators=[...fallbackRows];
let moegirlLocalCache={};
let moegirlLocalCachePromise=null;
let moegirlLocalCacheGeneratedAt='';
let target=null;let answered=false;let misses=0;let difficulty='all';let guesses=[];let roundSequence=0;
const maxMisses=10;

const guessInput=document.querySelector('#guess-input');
const guessFeedback=document.querySelector('#guess-feedback');

function escapeHtml(value=''){return String(value).replace(/[&<>"']/g,(ch)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}

function getClues(operator){
  const clues=[];
  if(operator.profession)clues.push({text:`${operator.profession}干员`,source:'official',evidence:'游戏内职业'});
  if(operator.rarity)clues.push({text:`${operator.rarity} 星`,source:'official',evidence:'游戏内稀有度'});
  (operator.tagList||[]).filter(Boolean).forEach((tag)=>clues.push({text:tag,source:'official',evidence:'游戏内干员标签'}));
  profileTags.forEach(([key,label])=>{const value=operator[key];if(value)clues.push({text:`${label}：${value}`,source:'profile',evidence:'干员档案'});});
  (operator.personality||[]).forEach((item)=>clues.push(typeof item==='string'?{text:item,source:'personality',evidence:'档案归纳'}:item));
  (operator.moeTags||[]).forEach((text)=>clues.push({text,source:'moegirl',evidence:'萌娘百科·萌点',url:operator.moeUrl}));
  const seen=new Set();return clues.filter((clue)=>{if(seen.has(clue.text))return false;seen.add(clue.text);return true;});
}

function operatorTags(operator){
  const seen=new Set();
  return getClues(operator).filter((clue)=>{if(seen.has(clue.text))return false;seen.add(clue.text);return true;});
}

function renderOperatorTagGroups(operator,answerTags){
  const tags=operatorTags(operator);const answerTexts=new Set(answerTags.map((tag)=>tag.text));
  const groups=[
    {source:'official',title:'游戏内信息'},
    {source:'profile',title:'干员档案'},
    {source:'personality',title:'档案性格（原文归纳）',empty:'暂无可靠性格标签'},
    {source:'moegirl',title:'萌娘百科萌点（独立线索）',empty:'暂无可用萌点标签'}
  ];
  return groups.map((group)=>{
    const items=tags.filter((tag)=>tag.source===group.source);
    if(!items.length&&!group.empty)return '';
    const contents=items.length?items.map((tag)=>{
      const matchClass=answerTexts.has(tag.text)?'tag-same':'tag-different';
      const detail=[tag.evidence,tag.url].filter(Boolean).join(' · ');
      return `<span class="operator-tag ${matchClass}" title="${escapeHtml(detail)}">${escapeHtml(tag.text)}</span>`;
    }).join(''):`<span class="operator-tag tag-unknown">${escapeHtml(group.empty)}</span>`;
    return `<section class="operator-tag-group"><h5>${escapeHtml(group.title)}</h5><div class="operator-tags">${contents}</div></section>`;
  }).join('');
}

function portraitUrl(operator){return operator.id?`https://web.hycdn.cn/arknights/game/assets/char/portrait/${encodeURIComponent(operator.id)}.png`:'';}
function avatarUrl(operator){return operator.id?`https://web.hycdn.cn/arknights/game/assets/char/avatar/${encodeURIComponent(operator.id)}.png`:'';}

function renderGuesses(){
  const history=document.querySelector('#guess-history');const container=document.querySelector('#guess-cards');
  history.hidden=!guesses.length;
  container.innerHTML=guesses.map(({operator},index)=>{
    const image=portraitUrl(operator);
    const tags=renderOperatorTagGroups(operator,operatorTags(target));
    const avatar=avatarUrl(operator);
    return `<article class="operator-card" style="animation-delay:${index*45}ms"><div class="operator-card-image">${image?`<img src="${escapeHtml(image)}" data-avatar="${escapeHtml(avatar)}" alt="${escapeHtml(operator.name)}干员立绘" loading="lazy" onerror="if(this.dataset.avatar&&!this.dataset.avatarTried){this.dataset.avatarTried='1';this.src=this.dataset.avatar}else{this.remove();this.parentElement.classList.add('image-missing')}">`:''}<span>${escapeHtml(operator.name.slice(0,1))}</span></div><div class="operator-card-content"><div class="operator-card-title"><div><h4>${escapeHtml(operator.name)}</h4><p>${escapeHtml(operator.profession||'未知职业')} · ${operator.rarity||'?'} 星 · ${escapeHtml(operator.position||'位置未公开')}</p></div><span class="guess-number">猜测 ${String(index+1).padStart(2,'0')}</span></div><div class="operator-tag-groups">${tags||'<span class="operator-tag tag-unknown">暂无可用标签</span>'}</div></div></article>`;
  }).join('');
}

function eligibleOperators(){return difficulty==='six'?operators.filter((operator)=>operator.rarity===6):operators;}

const moegirlTitleOverrides={'陈':'陈晖洁','麒麟R夜刀':'夜刀','斯卡蒂':'斯卡蒂(明日方舟)'};
const curatedMoegirlTags={
  '斯卡蒂':['尾扎长发','隐藏巨乳','御姐','佣兵','披风','短靴','温柔','孤僻','赏金猎人','巨剑','呆毛','腹白','白发红瞳','大腿内侧开口裤']
};
function moegirlTitle(operator){return moegirlTitleOverrides[operator.name]||operator.name;}
async function loadMoegirlLocalCache(){
  if(!moegirlLocalCachePromise)moegirlLocalCachePromise=(async()=>{
    try{
      const response=await fetch('./moegirl_tags.json',{cache:'no-store'});
      if(!response.ok)throw new Error('本地萌点缓存不可用');
      const data=await response.json();
      if(data?.operators){moegirlLocalCache=data.operators;moegirlLocalCacheGeneratedAt=data.generatedAt||'';}
      try{
        const saved=JSON.parse(localStorage.getItem('ccb-moegirl-local-cache-v1')||'null');
        if(saved?.operators){
          const snapshotTime=Date.parse(moegirlLocalCacheGeneratedAt)||0;
          const savedTime=Number(saved.updatedAt)||0;
          moegirlLocalCache=savedTime>snapshotTime?{...moegirlLocalCache,...saved.operators}:{...saved.operators,...moegirlLocalCache};
        }
      }catch{}
    }catch(error){console.warn('Moegirl local cache unavailable; online lookup will be used.',error);}
  })();
  return moegirlLocalCachePromise;
}
function persistMoegirlLocalCache(){
  try{localStorage.setItem('ccb-moegirl-local-cache-v1',JSON.stringify({generatedAt:moegirlLocalCacheGeneratedAt,updatedAt:Date.now(),operators:moegirlLocalCache}));}catch(error){console.warn('Unable to persist Moegirl cache',error);}
}
function extractMoegirlTags(wikitext,html){
  let raw='';
  if(html){
    const doc=new DOMParser().parseFromString(html,'text/html');
    const row=[...doc.querySelectorAll('tr')].find((item)=>/萌点|萌属性/.test(item.cells?.[0]?.textContent||''));
    raw=row?.cells?.[1]?.innerHTML||'';
  }
  if(!raw&&wikitext){
    const field=wikitext.match(/(?:^|\n)\s*\|\s*(?:萌点|萌属性)\s*=\s*([\s\S]*?)(?=\n\s*\|\s*[^|\n]+\s*=|\n\s*}}|$)/i);
    if(field)raw=field[1];
  }
  const normalized=raw.replace(/<!--([\s\S]*?)-->/g,'').replace(/<ref\b[^>]*>[\s\S]*?<\/ref>/gi,'')
    .replace(/<br\s*\/?\s*>/gi,'、').replace(/<[^>]*>/g,' ')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g,'$2').replace(/\[\[([^\]]+)\]\]/g,'$1').replace(/\[https?:\/\/[^\s\]]+\s+([^\]]+)\]/g,'$1')
    .replace(/\{\{\s*(?:萌点|萌属性)\s*\|/gi,'').replace(/\{\{[^{}]*\}\}/g,' ').replace(/\{\{|\}\}/g,'').replace(/'{2,}/g,'');
  return [...new Set(normalized.split(/[，,；;、/|\n\r]+/).map((tag)=>tag.replace(/[（(].*?[）)]/g,'').replace(/^\s*\d+\s*=\s*/,'').trim()).filter((tag)=>tag&&tag.length<=18&&!/^(萌点|萌属性|无|暂无|不明)$/.test(tag)))];
}
async function loadMoegirlTags(operator){
  if(operator.moeLoaded)return;
  if(operator.moePromise)return operator.moePromise;
  const title=moegirlTitle(operator);const key=`ccb-moegirl-tags-v3:${title}`;operator.moeUrl=`https://moegirl.uk/index.php?title=${encodeURIComponent(title)}`;
  operator.moePromise=(async()=>{
    try{
      await loadMoegirlLocalCache();
      const cached=moegirlLocalCache[operator.name];
      if(cached){operator.moeTags=Array.isArray(cached.tags)?cached.tags:[];operator.moeUrl=cached.url||operator.moeUrl;operator.moeLoaded=true;return;}
      const saved=JSON.parse(localStorage.getItem(key)||'null');
      if(saved&&Date.now()-saved.time<7*24*60*60*1000&&Array.isArray(saved.tags)&&saved.tags.length){operator.moeTags=saved.tags;operator.moeLoaded=true;return;}
      let parsed=null;let tags=[];let resolvedTitle=title;
      const titles=[...new Set([title,`${operator.name}(明日方舟)`,`${operator.name}(明日方舟干员)`])];
      const domains=['moegirl.uk','moegirl.icu'];
      const tryPage=async(candidate)=>{
        for(const domain of domains){
          try{
            const endpoint=new URL(`https://${domain}/api.php`);
            endpoint.search=new URLSearchParams({action:'parse',page:candidate,prop:'wikitext|text',format:'json',origin:'*'}).toString();
            const response=await fetch(endpoint,{mode:'cors',signal:AbortSignal.timeout(9000)});
            if(!response.ok)continue;
            const data=await response.json();if(!data?.parse)continue;
            const candidateTags=extractMoegirlTags(data.parse.wikitext?.['*'],data.parse.text?.['*']);
            if(candidateTags.length){parsed=data.parse;tags=candidateTags;resolvedTitle=data.parse.title||candidate;return true;}
          }catch{}
        }
        return false;
      };
      for(const candidate of titles)if(await tryPage(candidate))break;
      // Many Moegirl pages use a non-obvious canonical title. Ask MediaWiki's
      // own search index for exact-name article candidates before declaring a miss.
      if(!parsed){
        for(const domain of domains){
          try{
            const endpoint=new URL(`https://${domain}/api.php`);
            endpoint.search=new URLSearchParams({action:'query',list:'search',srsearch:`"${operator.name}" 明日方舟`,srlimit:'8',format:'json',origin:'*'}).toString();
            const response=await fetch(endpoint,{mode:'cors',signal:AbortSignal.timeout(9000)});
            if(!response.ok)continue;
            const results=(await response.json())?.query?.search||[];
            const candidates=results.map((item)=>item.title).filter((candidate)=>candidate.includes(operator.name));
            for(const candidate of candidates)if(await tryPage(candidate))break;
            if(parsed)break;
          }catch{}
        }
      }
      if(!parsed&&!curatedMoegirlTags[operator.name])throw new Error('Moegirl page or tags unavailable');
      if(!tags.length)tags=curatedMoegirlTags[operator.name]||[];
      if(parsed)operator.moeUrl=`https://moegirl.uk/index.php?title=${encodeURIComponent(resolvedTitle)}`;
      operator.moeTags=tags;operator.moeLoaded=true;
      if(tags.length)localStorage.setItem(key,JSON.stringify({tags,time:Date.now()}));
      moegirlLocalCache[operator.name]={tags,title:resolvedTitle,url:operator.moeUrl,candidates:titles,revision:parsed?.revid||null,status:tags.length?'found':'no-tagged-page'};persistMoegirlLocalCache();
    }catch{if(curatedMoegirlTags[operator.name]){operator.moeTags=curatedMoegirlTags[operator.name];operator.moeLoaded=true;}else operator.moeTags=operator.moeTags||[];}
    finally{operator.moePromise=null;}
  })();
  return operator.moePromise;
}

async function syncMoegirlUpdates(){
  await loadMoegirlLocalCache();
  if(!navigator.onLine)return;
  const metaKey='ccb-moegirl-sync-meta-v1';
  let meta={};try{meta=JSON.parse(localStorage.getItem(metaKey)||'{}')||{};}catch{}
  const now=Date.now();
  const lastChecked=Math.max(Number(meta.lastChecked)||0,Date.parse(moegirlLocalCacheGeneratedAt)||0)||now;
  if(meta.lastChecked&&now-lastChecked<12*60*60*1000)return;
  try{
    const since=new Date(lastChecked-60_000).toISOString().replace(/\.\d{3}Z$/,'Z');
    const changes=[];let continuation='';let continueToken='';
    for(let page=0;page<5;page++){
      const endpoint=new URL('https://moegirl.uk/api.php');
      endpoint.search=new URLSearchParams({action:'query',list:'recentchanges',rcnamespace:'0',rcstart:since,rcend:new Date(now).toISOString().replace(/\.\d{3}Z$/,'Z'),rcdir:'newer',rcprop:'title|timestamp|ids',rclimit:'max',format:'json',origin:'*',...(continuation?{rccontinue:continuation,continue:continueToken}:{})}).toString();
      const response=await fetch(endpoint,{mode:'cors',signal:AbortSignal.timeout(12000)});if(!response.ok)throw new Error('萌娘百科更新检查失败');
      const data=await response.json();changes.push(...(data?.query?.recentchanges||[]));
      continuation=data?.continue?.rccontinue||'';continueToken=data?.continue?.continue||'';if(!continuation)break;
    }
    const changedTitles=[...new Set(changes.map((change)=>change.title).filter((pageTitle)=>operators.some((operator)=>{
      const cached=moegirlLocalCache[operator.name];
      const candidates=cached?.candidates||[moegirlTitle(operator),`${operator.name}(明日方舟)`,`${operator.name}(明日方舟干员)`];
      return cached?.title===pageTitle||candidates.includes(pageTitle)||(operator.name.length>=3&&pageTitle.includes(operator.name));
    })))];
    for(let offset=0;offset<changedTitles.length;offset+=40){
      const batch=changedTitles.slice(offset,offset+40);const endpoint=new URL('https://moegirl.uk/api.php');
      endpoint.search=new URLSearchParams({action:'query',prop:'revisions',rvprop:'ids|timestamp|content',rvslots:'main',titles:batch.join('|'),format:'json',origin:'*'}).toString();
      const response=await fetch(endpoint,{mode:'cors',signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('萌点更新下载失败');
      const data=await response.json();
      for(const page of Object.values(data?.query?.pages||{})){
        const revision=page?.revisions?.[0];if(!revision)continue;
        const title=page.title;const tags=extractMoegirlTags(revision.slots?.main?.['*']||'','');
        const linked=operators.filter((operator)=>{
          const cached=moegirlLocalCache[operator.name];
          const candidates=cached?.candidates||[moegirlTitle(operator),`${operator.name}(明日方舟)`,`${operator.name}(明日方舟干员)`];
          return cached?.title===title||candidates.includes(title)||(tags.length>0&&operator.name.length>=3&&title.includes(operator.name));
        });
        for(const operator of linked){
          const old=moegirlLocalCache[operator.name];if(!tags.length&&old?.title!==title)continue;
          const entry={...(old||{}),tags,title,url:`https://moegirl.uk/index.php?title=${encodeURIComponent(title)}`,revision:revision.revid,modified:revision.timestamp,status:tags.length?'found':'no-tagged-page'};
          moegirlLocalCache[operator.name]=entry;
          if(target?.name===operator.name){target.moeTags=tags;target.moeUrl=entry.url;target.moeLoaded=true;}
          guesses.filter((guess)=>guess.operator.name===operator.name).forEach((guess)=>{guess.operator.moeTags=tags;guess.operator.moeUrl=entry.url;guess.operator.moeLoaded=true;});
        }
      }
    }
    localStorage.setItem(metaKey,JSON.stringify({lastChecked:now}));
    persistMoegirlLocalCache();
    renderGuesses();
    const added=operators.filter((operator)=>!moegirlLocalCache[operator.name]);
    if(added.length){await Promise.allSettled(added.map((operator)=>loadMoegirlTags(operator)));}
    const status=document.querySelector('#data-status');
    status.textContent=`干员档案已检查 · 萌点同步 ${new Date(now).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`;
  }catch(error){console.warn('Moegirl update sync failed; using local cache.',error);}
}

function beginRound(){
  const eligible=eligibleOperators();if(!eligible.length)return;
  const round=++roundSequence;
  target=eligible[Math.floor(Math.random()*eligible.length)];
  answered=false;misses=0;guesses=[];renderGuesses();guessInput.value='';document.querySelector('#clear-input').hidden=true;hideOperatorResults();guessFeedback.textContent='';guessFeedback.className='guess-feedback';
  guessInput.disabled=true;document.querySelector('#guess-form button[type="submit"]').disabled=true;document.querySelector('#give-up-button').disabled=true;
  document.querySelector('#round-status').textContent='正在载入目标干员档案…';updateStats();
  loadMoegirlTags(target).then(()=>{
    if(round!==roundSequence)return;
    guessInput.disabled=false;document.querySelector('#guess-form button[type="submit"]').disabled=false;document.querySelector('#give-up-button').disabled=false;
    document.querySelector('#round-status').textContent='档案就绪，可以开始猜测';updateStats();
  });
}

function derivePersonalityTags(archiveText,name){
  const source=`${archiveText||''}`;
  const url=`https://prts.wiki/w/${encodeURIComponent(name)}`;
  return personalityLexicon.flatMap((tag)=>{
    let offset=source.indexOf(tag);
    while(offset!==-1){
      const before=source.slice(Math.max(0,offset-7),offset);
      if(!/(不|未|非|无|难以|并非|并不)$/.test(before)){
        const start=Math.max(source.lastIndexOf('。',offset),source.lastIndexOf('！',offset),source.lastIndexOf('？',offset),source.lastIndexOf('\n',offset))+1;
        const ends=['。','！','？','\n'].map((mark)=>{const at=source.indexOf(mark,offset);return at<0?source.length:at;});
        const excerpt=source.slice(start,Math.min(...ends)).trim().slice(0,100);
        return [{text:tag,source:'personality',evidence:excerpt?`档案原文：${excerpt}`:'档案原文关键词',url}];
      }
      offset=source.indexOf(tag,offset+tag.length);
    }
    return [];
  });
}

function updateStats(){
  const total=eligibleOperators().length;const remaining=Math.max(0,total-guesses.length);
  document.querySelector('#candidate-count').textContent=String(remaining).padStart(2,'0');
  document.querySelector('#miss-count').innerHTML=`${misses} <i>/ ${maxMisses}</i>`;
  document.querySelector('#miss-fill').style.width=`${Math.min(100,misses/maxMisses*100)}%`;
  document.querySelectorAll('.miss-ticks i').forEach((tick,index)=>tick.classList.toggle('filled',index<misses));
  const ratio=total?guesses.length/total:0;document.querySelector('#progress-fill').style.width=`${ratio*100}%`;
}

async function submitGuess(event){
  event.preventDefault();if(answered||!target)return;
  const guess=guessInput.value.trim();if(!guess){guessFeedback.textContent='先输入一个干员代号。';return;}
  const guessedOperator=eligibleOperators().find((operator)=>operator.name.toLocaleLowerCase()===guess.toLocaleLowerCase()||operator.en?.toLocaleLowerCase()===guess.toLocaleLowerCase());
  if(!guessedOperator){guessFeedback.textContent='请从当前挑战范围内选择一位干员。';guessFeedback.className='guess-feedback wrong';return;}
  if(guesses.some((entry)=>entry.operator.name===guessedOperator.name)){guessFeedback.textContent='这位干员已经猜过了，换一位试试。';guessFeedback.className='guess-feedback wrong';return;}
  const roundTarget=target;guesses.push({operator:guessedOperator});renderGuesses();guessInput.value='';document.querySelector('#clear-input').hidden=true;hideOperatorResults();
  loadMoegirlTags(guessedOperator).then(()=>{if(target===roundTarget)renderGuesses();});
  if(guessedOperator.name===target.name){
    answered=true;guessFeedback.textContent=`回答正确：${target.name}！`;guessFeedback.className='guess-feedback correct';
    guessInput.disabled=true;document.querySelector('#guess-form button[type="submit"]').disabled=true;document.querySelector('#give-up-button').disabled=true;
    document.querySelector('#round-status').textContent=`已确认身份：${target.name}`;updateStats();return;
  }
  misses++;
  if(misses>=maxMisses){
    answered=true;guessFeedback.textContent=`已连续猜错 ${maxMisses} 次，正确答案是：${target.name}。`;guessFeedback.className='guess-feedback wrong';
    guessInput.disabled=true;document.querySelector('#guess-form button[type="submit"]').disabled=true;document.querySelector('#give-up-button').disabled=true;
    document.querySelector('#round-status').textContent=`本轮结束 · 正确答案：${target.name}`;updateStats();return;
  }
  guessFeedback.textContent=`猜错了。请查看名片上的标签对照，再试一位。（已猜 ${misses} 次，最多 ${maxMisses} 次）`;guessFeedback.className='guess-feedback wrong';
  document.querySelector('#round-status').textContent=`已猜过 ${misses} 次，继续尝试`;updateStats();
}

function giveUp(){
  if(answered||!target)return;
  answered=true;guessFeedback.textContent=`已放弃猜测，本轮正确答案是：${target.name}。`;guessFeedback.className='guess-feedback wrong';
  guessInput.disabled=true;document.querySelector('#guess-form button[type="submit"]').disabled=true;document.querySelector('#give-up-button').disabled=true;
  document.querySelector('#round-status').textContent=`本轮结束 · 正确答案：${target.name}`;updateStats();
}

const professionSearchNames={
  '先锋':['先锋','先锋干员'],'近卫':['近卫','近卫干员'],'重装':['重装','重装干员'],'狙击':['狙击','狙击干员'],
  '术师':['术师','术士','法师','术师干员','术士干员'],'医疗':['医疗','医疗干员','治疗'],'辅助':['辅助','辅助干员'],'特种':['特种','特种干员']
};
const operatorResults=document.querySelector('#operator-results');
let activeResultIndex=-1;

function hideOperatorResults(){operatorResults.hidden=true;operatorResults.innerHTML='';activeResultIndex=-1;guessInput.setAttribute('aria-expanded','false');guessInput.removeAttribute('aria-activedescendant');}
function chooseOperatorResult(button){
  if(!button)return;
  if(button.dataset.region){guessInput.value=button.dataset.region;document.querySelector('#clear-input').hidden=false;renderOperatorResults();guessInput.focus();return;}
  guessInput.value=button.dataset.operatorName;
  document.querySelector('#clear-input').hidden=false;
  hideOperatorResults();
  guessInput.focus();
}
function renderOperatorResults(){
  const query=guessInput.value.trim().toLocaleLowerCase();
  if(!query){hideOperatorResults();return;}
  const pool=eligibleOperators();
  const professions=Object.keys(professionSearchNames).filter((profession)=>professionSearchNames[profession].some((alias)=>alias.toLocaleLowerCase()===query));
  const rarityMatch=query.match(/^(?:六星|6星|6\s*星|六星干员|6星干员)$/);
  let rows=[];let heading='检索结果';
  if(['地区','地区干员','出身地'].includes(query)){
    const regions=[...new Set(pool.map((operator)=>operator.nation).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'zh-CN'));
    operatorResults.innerHTML=regions.length?`<div class="operator-results-heading">选择地区 · ${regions.length} 个</div>${regions.map((region,index)=>`<button type="button" class="operator-result" role="option" id="operator-result-${index}" data-region="${escapeHtml(region)}" aria-selected="false"><span class="operator-result-name">${escapeHtml(region)}</span><span class="operator-result-meta">查看该地区干员</span></button>`).join('')}`:'<div class="operator-results-empty">当前档案没有可用的地区信息</div>';
    operatorResults.hidden=false;activeResultIndex=-1;guessInput.setAttribute('aria-expanded','true');return;
  }else if(professions.length){
    rows=pool.filter((operator)=>professions.includes(operator.profession));
    heading=`${professions.join(' / ')}干员 · ${rows.length} 位`;
  }else if(rarityMatch){
    rows=pool.filter((operator)=>operator.rarity===6);
    heading=`六星干员 · ${rows.length} 位`;
  }else if(pool.some((operator)=>(operator.nation||'').toLocaleLowerCase().includes(query))){
    rows=pool.filter((operator)=>(operator.nation||'').toLocaleLowerCase().includes(query));
    heading=`地区：${query} · ${rows.length} 位`;
  }else{
    const matched=pool.map((operator)=>{
      const name=(operator.name||'').toLocaleLowerCase(),en=(operator.en||'').toLocaleLowerCase(),region=(operator.nation||'').toLocaleLowerCase();
      const rank=name===query||en===query?0:name.startsWith(query)||en.startsWith(query)?1:name.includes(query)||en.includes(query)||region.includes(query)?2:-1;
      return {operator,rank};
    }).filter((row)=>row.rank>=0).sort((a,b)=>a.rank-b.rank||a.operator.name.localeCompare(b.operator.name,'zh-CN'));
    rows=matched.slice(0,40).map((row)=>row.operator);
    heading=matched.length>40?`检索结果 · 显示前 40 位（共 ${matched.length} 位）`:`检索结果 · ${matched.length} 位`;
  }
  if(!rows.length){operatorResults.innerHTML='<div class="operator-results-empty">没有找到符合条件的干员</div>';operatorResults.hidden=false;guessInput.setAttribute('aria-expanded','true');return;}
  operatorResults.innerHTML=`<div class="operator-results-heading">${escapeHtml(heading)}</div>${rows.map((operator,index)=>`<button type="button" class="operator-result" role="option" id="operator-result-${index}" data-operator-name="${escapeHtml(operator.name)}" aria-selected="false"><span class="operator-result-name">${escapeHtml(operator.name)}</span><span class="operator-result-meta">${escapeHtml(operator.profession||'未知职业')} · ${operator.rarity||'?'} 星</span></button>`).join('')}`;
  operatorResults.hidden=false;activeResultIndex=-1;guessInput.setAttribute('aria-expanded','true');
}
function populateNames(){renderOperatorResults();}

async function loadRoster(){
  const status=document.querySelector('#data-status');
  let hasFullCache=false;
  try{
    const cached=JSON.parse(localStorage.getItem('ccb-operator-roster-v1')||'null');
    if(Array.isArray(cached?.operators)&&cached.operators.length>fallbackRows.length){operators=cached.operators;hasFullCache=true;status.textContent=`本地完整档案缓存 ${operators.length} 位`;populateNames();beginRound();}
  }catch{}
  status.textContent='正在连接完整干员数据库…';
  try{
    async function fetchGameData(file){
      // Revalidate the maintained game-data mirror on each launch; local files remain the offline fallback.
      const urls=[
        `https://cdn.jsdelivr.net/gh/ArknightsAssets/ArknightsGamedata@master/cn/gamedata/excel/${file}`,
        `https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/master/cn/gamedata/excel/${file}`,
        `https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/zh_CN/gamedata/excel/${file}`,
        `https://cdn.jsdelivr.net/gh/Kengxxiao/ArknightsGameData@master/zh_CN/gamedata/excel/${file}`,
      ];
      let failure;
      for(const url of urls){try{const response=await fetch(url,{cache:'no-cache'});if(!response.ok)throw new Error(`HTTP ${response.status}`);const data=await response.json();if(file==='character_table.json'){const count=Object.values(data).filter((item)=>item?.name&&classCodes[item.profession]&&normalizeRarity(item.rarity)>0).length;if(count<100)throw new Error('Character table is incomplete');}return data;}catch(error){failure=error;}}
      try{
        const response=await fetch(`./${file}`,{cache:'no-cache'});
        if(response.ok){
          const data=await response.json();
          if(file!=='character_table.json'||Object.values(data).filter((item)=>item?.name&&classCodes[item.profession]&&normalizeRarity(item.rarity)>0).length>=100)return data;
        }
      }catch(error){console.warn(`Local game data unavailable: ${file}`,error);}
      throw failure||new Error('game data unavailable');
    }
    const source=await fetchGameData('character_table.json');
    const handbook=await fetchGameData('handbook_info_table.json').catch(()=>({}));
    const handbookRows=handbook.handbookDict||handbook;
    const handbookById=new Map(Object.entries(handbookRows).filter(([,item])=>item?.charID).map(([,item])=>[item.charID,item]));
    function archiveText(charId){
      const file=handbookById.get(charId);const ignored=['Basic Info','Physical Exam','Clinical Analysis','基础档案','综合体检测试','临床诊断分析'];
      return (file?.storyTextAudio||[]).filter((section)=>!ignored.includes(section.storyTitle)).flatMap((section)=>section.stories||[]).map((story)=>story.storyText||'').join('\n');
    }
    function archiveFact(charId,key){
      const file=handbookById.get(charId);const text=file?.storyTextAudio?.[0]?.stories?.[0]?.storyText||'';
      const labels={gender:'性别',race:'种族',nation:'出身地',birthday:'生日'};const found=text.match(new RegExp(`(?:\\[${labels[key]}\\]|【${labels[key]}】)\\s*([^\\n\\r]+)`));
      const value=found?.[1]?.trim()||'';return value==='未公开'||value==='不详'||value==='未知'?'':value;
    }
    const online=Object.entries(source).filter(([,item])=>item?.name&&classCodes[item.profession]&&normalizeRarity(item.rarity)>0&&!item.isNotObtainable&&!item.name.startsWith('预')).map(([charId,item])=>{
      const fromArchive=derivePersonalityTags(archiveText(charId),item.name);
      const curated=(personalityNotes[item.name]?.tags||[]).map((text)=>({text,source:'personality',evidence:personalityNotes[item.name].evidence,url:personalityNotes[item.name].url}));
      const traits=new Map([...fromArchive,...curated].map((clue)=>[clue.text,clue]));
      return {id:charId,name:item.name,profession:classCodes[item.profession],rarity:normalizeRarity(item.rarity),position:item.position==='MELEE'?'近战位':item.position==='RANGED'?'远程位':'',tagList:Array.isArray(item.tagList)?item.tagList:[],gender:archiveFact(charId,'gender'),race:archiveFact(charId,'race'),nation:archiveFact(charId,'nation'),birthday:archiveFact(charId,'birthday'),personality:[...traits.values()]};
    });
    const unique=new Map(online.map((operator)=>[operator.name,operator]));
    if(unique.size>fallbackRows.length){operators=[...unique.values()];try{localStorage.setItem('ccb-operator-roster-v1',JSON.stringify({operators,updatedAt:Date.now()}));}catch{}const personalityCount=operators.filter((operator)=>operator.personality.length).length;status.textContent=`游戏档案已更新 ${operators.length} 位 · 性格归纳 ${personalityCount} 位`;populateNames();beginRound();syncMoegirlUpdates();}
    else throw new Error('The online roster is incomplete');
  }catch(error){console.error('Unable to load operator data',error);status.textContent=hasFullCache?`本地完整档案缓存 ${operators.length} 位（离线）`:`本地精选名单 ${operators.length} 位（数据加载失败：${error?.message||'未知错误'}）`;if(hasFullCache)syncMoegirlUpdates();}
}

document.querySelector('#new-game-button').addEventListener('click',beginRound);
document.querySelector('#guess-form').addEventListener('submit',submitGuess);
document.querySelector('#give-up-button').addEventListener('click',giveUp);
document.querySelectorAll('.difficulty-button').forEach((button)=>button.addEventListener('click',()=>{
  difficulty=button.dataset.difficulty;
  document.querySelectorAll('.difficulty-button').forEach((item)=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});
  populateNames();beginRound();
}));
document.querySelector('#clear-input').addEventListener('click',()=>{guessInput.value='';guessInput.focus();});
guessInput.addEventListener('input',()=>{document.querySelector('#clear-input').hidden=!guessInput.value;renderOperatorResults();});
guessInput.addEventListener('keydown',(event)=>{
  const options=[...operatorResults.querySelectorAll('.operator-result')];
  if(event.key==='ArrowDown'&&options.length){event.preventDefault();activeResultIndex=(activeResultIndex+1)%options.length;}
  else if(event.key==='ArrowUp'&&options.length){event.preventDefault();activeResultIndex=(activeResultIndex-1+options.length)%options.length;}
  else if(event.key==='Escape'){hideOperatorResults();return;}
  else if(event.key==='Enter'&&activeResultIndex>=0&&options[activeResultIndex]){event.preventDefault();chooseOperatorResult(options[activeResultIndex]);return;}
  else return;
  options.forEach((option,index)=>{const active=index===activeResultIndex;option.classList.toggle('active',active);option.setAttribute('aria-selected',String(active));});
  guessInput.setAttribute('aria-activedescendant',options[activeResultIndex].id);
  options[activeResultIndex].scrollIntoView({block:'nearest'});
});
operatorResults.addEventListener('mousedown',(event)=>{const option=event.target.closest('.operator-result');if(option){event.preventDefault();chooseOperatorResult(option);}});
document.addEventListener('mousedown',(event)=>{if(!event.target.closest('#guess-form'))hideOperatorResults();});
document.querySelector('#clear-input').addEventListener('click',()=>hideOperatorResults());
document.querySelectorAll('[data-search-query]').forEach((button)=>button.addEventListener('click',()=>{
  guessInput.value=button.dataset.searchQuery;document.querySelector('#clear-input').hidden=false;renderOperatorResults();guessInput.focus();
  document.querySelectorAll('[data-search-query]').forEach((item)=>item.classList.toggle('active',item===button));
}));
loadMoegirlLocalCache();populateNames();beginRound();loadRoster();

function initMusicPlayer(){
  const isLocalSite=['localhost','127.0.0.1'].includes(location.hostname);
  const musicApiBase=isLocalSite&&location.port!=='8001'?`${location.protocol}//127.0.0.1:8001/api/msr`:'/api/msr';
  const audio=document.querySelector('#bgm-audio');
  const trackSelect=document.querySelector('#music-track');
  const categorySelect=document.querySelector('#music-category');
  const searchInput=document.querySelector('#music-search');
  const playButton=document.querySelector('#music-toggle');
  const status=document.querySelector('#music-status');
  const currentLabel=document.querySelector('#music-now-playing');
  const liveLabel=document.querySelector('#music-live');
  const detailCache=new Map();
  let catalog=[];let selectedCid='';let loadedCid='';
  const storedVolume=Number(localStorage.getItem('ccb-music-volume'));
  audio.volume=Number.isFinite(storedVolume)&&storedVolume>0?Math.min(1,storedVolume):0.25;
  document.querySelector('#music-volume').value=String(audio.volume);
  const storedCategory=localStorage.getItem('ccb-music-category');
  if(['all','ost','single'].includes(storedCategory))categorySelect.value=storedCategory;

  function classifyAlbum(name=''){return /(?:\bOST\b|原声(?:带|EP)?|soundtrack)/i.test(name)?'ost':'single';}
  function renderCatalog(){
    const query=searchInput.value.trim().toLocaleLowerCase();
    const category=categorySelect.value;
    const visible=catalog.filter((song)=>{
      if(category!=='all'&&song.category!==category)return false;
      return !query||`${song.name} ${song.albumName} ${(song.artists||[]).join(' ')}`.toLocaleLowerCase().includes(query);
    });
    const options=visible.map((song)=>`<option value="${escapeHtml(song.cid)}">${escapeHtml(song.name)} · ${escapeHtml(song.albumName||'塞壬唱片')}</option>`).join('');
    trackSelect.innerHTML=options||'<option value="">没有找到曲目</option>';
    if(visible.some((song)=>song.cid===selectedCid))trackSelect.value=selectedCid;
    else if(visible.length){if(loadedCid&&loadedCid!==visible[0].cid){audio.pause();audio.removeAttribute('src');audio.load();loadedCid='';}trackSelect.value=visible[0].cid;selectedCid=visible[0].cid;updateSelectedLabel();}
    else{selectedCid='';currentLabel.textContent='选择背景音乐';}
    status.textContent=`共 ${visible.length} 首可选`;
  }
  function findSelected(){return catalog.find((song)=>song.cid===selectedCid);}
  function updateSelectedLabel(){const song=findSelected();currentLabel.textContent=song?song.name:'选择背景音乐';}
  async function fetchCatalog(){
    const cacheKey='ccb-msr-catalog-v1';
    try{const saved=JSON.parse(localStorage.getItem(cacheKey)||'null');if(Array.isArray(saved?.songs)&&Date.now()-saved.savedAt<12*60*60*1000)catalog=saved.songs;}catch{}
    if(catalog.length){renderCatalog();status.textContent=`官方曲库缓存 · ${catalog.length} 首`;}
    try{
      const [songResponse,albumResponse]=await Promise.all([
        fetch(`${musicApiBase}/songs`,{cache:'no-cache'}),
        fetch(`${musicApiBase}/albums`,{cache:'no-cache'})
      ]);
      if(!songResponse.ok||!albumResponse.ok)throw new Error('官方曲库暂时无法连接');
      const [songPayload,albumPayload]=await Promise.all([songResponse.json(),albumResponse.json()]);
      const albums=new Map((albumPayload.data||[]).map((album)=>[album.cid,album.name]));
      const songs=songPayload.data?.list||[];
      if(!songs.length)throw new Error('官方曲库没有返回歌曲');
      catalog=songs.map((song)=>({cid:String(song.cid),name:song.name||'未命名曲目',albumCid:String(song.albumCid||''),albumName:albums.get(String(song.albumCid))||'',artists:song.artists||[],category:classifyAlbum(albums.get(String(song.albumCid))||'')}));
      try{localStorage.setItem(cacheKey,JSON.stringify({savedAt:Date.now(),songs:catalog}));}catch{}
      renderCatalog();status.textContent=`塞壬唱片已连接 · ${catalog.length} 首官方曲目`;
    }catch(error){
      console.warn('Unable to load Monster Siren catalog.',error);
      if(!catalog.length){trackSelect.innerHTML='<option value="">曲库连接失败</option>';status.textContent='无法连接官方曲库，请稍后重试';liveLabel.textContent='离线';}
    }
  }
  async function playSelected(){
    const song=findSelected();
    if(!song){status.textContent='请先选择一首曲目';return;}
    try{
      if(loadedCid!==song.cid){
        status.textContent='正在读取官方音源…';
        let detail=detailCache.get(song.cid);
        if(!detail){const response=await fetch(`${musicApiBase}/song/${encodeURIComponent(song.cid)}`);if(!response.ok)throw new Error('音源信息读取失败');const payload=await response.json();detail=payload.data;if(!detail?.sourceUrl)throw new Error('该曲目没有可播放音源');detailCache.set(song.cid,detail);}
        audio.src=detail.sourceUrl;audio.load();loadedCid=song.cid;
      }
      await audio.play();
    }catch(error){console.warn('Audio playback failed.',error);status.textContent=error?.name==='NotAllowedError'?'请点击播放按钮开始音乐':'音源暂时无法播放，请换一首试试';liveLabel.textContent='待机';}
  }
  function stepTrack(direction){
    const options=[...trackSelect.options].filter((option)=>option.value);
    if(!options.length)return;
    let index=options.findIndex((option)=>option.value===selectedCid);
    index=(index+direction+options.length)%options.length;
    trackSelect.value=options[index].value;trackSelect.dispatchEvent(new Event('change'));
    playSelected();
  }
  trackSelect.addEventListener('change',()=>{
    selectedCid=trackSelect.value;
    const song=findSelected();updateSelectedLabel();
    if(loadedCid!==selectedCid){audio.pause();audio.removeAttribute('src');audio.load();loadedCid='';}
    if(song)status.textContent=`已选择：${song.name} · 点击播放`;
  });
  categorySelect.addEventListener('change',()=>{localStorage.setItem('ccb-music-category',categorySelect.value);renderCatalog();});
  searchInput.addEventListener('input',renderCatalog);
  playButton.addEventListener('click',()=>{if(audio.paused)playSelected();else audio.pause();});
  document.querySelector('#music-prev').addEventListener('click',()=>stepTrack(-1));
  document.querySelector('#music-next').addEventListener('click',()=>stepTrack(1));
  document.querySelector('#music-volume').addEventListener('input',(event)=>{audio.volume=Number(event.target.value);localStorage.setItem('ccb-music-volume',String(audio.volume));});
  audio.addEventListener('play',()=>{playButton.textContent='Ⅱ 暂停';playButton.setAttribute('aria-label','暂停背景音乐');liveLabel.textContent='播放中';status.textContent=`正在播放：${findSelected()?.name||'背景音乐'}`;document.querySelector('.music-equalizer').classList.add('playing');});
  audio.addEventListener('pause',()=>{playButton.textContent='▶ 播放';playButton.setAttribute('aria-label','播放背景音乐');if(liveLabel.textContent==='播放中')liveLabel.textContent='已暂停';document.querySelector('.music-equalizer').classList.remove('playing');});
  audio.addEventListener('ended',()=>{liveLabel.textContent='已结束';status.textContent='本曲播放完毕';});
  audio.addEventListener('error',()=>{if(audio.currentSrc){status.textContent='音源加载失败，请检查网络或换一首曲目';liveLabel.textContent='错误';}});
  fetchCatalog();
}
initMusicPlayer();
