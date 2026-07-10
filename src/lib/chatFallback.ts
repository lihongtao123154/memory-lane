type FallbackTurn = {
  question: string
  options: { text: string; trait: string }[]
  reactions: Record<string, string>
}

type FallbackTemplate = {
  greeting: string
  turns: FallbackTurn[]
  reflection: string
}

const TEMPLATES: Record<string, FallbackTemplate[]> = {
  happy: [
    {
      greeting: '啊，{title}——光是提起这个名字，你的嘴角就微微上扬了。\n\n那是 {year} 年的事了吧？跟我聊聊吧——那一天，是什么让你这么开心？',
      turns: [
        {
          question: '当时你身边有谁吗？还是说，那一刻你是独自一人，静静地享受着快乐？',
          options: [{ text: '和重要的人在一起', trait: 'sentiment' }, { text: '一个人独享的时刻', trait: 'ratio' }],
          reactions: { '和重要的人在一起': '有人分享的快乐是双倍的。那些和你一起笑过的人，是你人生中最温暖的背景色。', '一个人独享的时刻': '有时候，真正的快乐恰恰不需要观众。那是只属于你一个人的宝藏。' }
        },
        {
          question: '如果给那天的快乐定一个颜色，你觉得是什么颜色？',
          options: [{ text: '金色的，像阳光', trait: 'courage' }, { text: '粉色的，像晚霞', trait: 'sentiment' }, { text: '透明的，像清风', trait: 'wisdom' }],
          reactions: { '金色的，像阳光': '金色——那是一种温暖的、让人安心的颜色。你的记忆里有很多这样的光芒吧。', '粉色的，像晚霞': '粉色是浪漫的颜色。那一天的记忆一定柔软得像一片花瓣。', '透明的，像清风': '透明的快乐最难得——不依附于任何东西，只是纯粹的存在。' }
        },
        {
          question: '如果再让你回到那一天，你会想对自己说什么？',
          options: [{ text: '"你会一直记得这一天的"', trait: 'wisdom' }, { text: '"享受当下，别想太多"', trait: 'sentiment' }, { text: '"未来还有更多好事"', trait: 'courage' }],
          reactions: { '"你会一直记得这一天的"': '是的——你确实记得。记忆是最忠诚的守护者。', '"享受当下，别想太多"': '说得对。很多快乐都因为我们想太多而打了折扣。', '"未来还有更多好事"': '你的眼神一直向前看。正是这种信念，让你走到了今天。' }
        }
      ],
      reflection: '每一次回望快乐的记忆，都是在告诉自己：我拥有过美好，也值得更多美好。\n\n这份快乐不是凭空的礼物，而是你生命中的一道光。把它收好，它会继续照亮你前方的路。'
    }
  ],
  sad: [
    {
      greeting: '{title}……这段记忆带着一点重量呢。\n\n{year} 年发生的事情，现在想起来还会让你心里一紧吗？如果你想聊聊，我在这里。',
      turns: [
        {
          question: '那时候，是什么让你最难过的？或者——你愿意说说发生了什么吗？',
          options: [{ text: '失去了重要的人或事', trait: 'sentiment' }, { text: '期待落空了', trait: 'ratio' }, { text: '被人误解或伤害', trait: 'courage' }],
          reactions: { '失去了重要的人或事': '失去是人生最艰难的课题之一。那种痛不是因为脆弱，而是因为在乎。', '期待落空了': '期望越大，失望越深。但你知道吗？正因为你敢于期待，你才有那么多美好的可能。', '被人误解或伤害': '被误解的痛是双重的——不仅痛，还孤独。但我相信你比那些伤害更强大。' }
        },
        {
          question: '那时候的你，是怎么熬过来的？',
          options: [{ text: '靠时间慢慢淡忘', trait: 'wisdom' }, { text: '有朋友陪在身边', trait: 'sentiment' }, { text: '把自己投入工作和学习', trait: 'courage' }],
          reactions: { '靠时间慢慢淡忘': '时间是最好的良药，但真正治愈你的，是你自己愿意走出来的决心。', '有朋友陪在身边': '真正的朋友就是那些在你难过时，不需要你说什么，只是静静陪着你的人。', '把自己投入工作和学习': '你选择用行动对抗悲伤。那些你所做的事情，其实都是你在对自己说："我可以的。"' }
        },
        {
          question: '现在回看那段经历，你觉得它有没有带给你一些什么？哪怕是微不足道的改变。',
          options: [{ text: '让我变得更坚强了', trait: 'courage' }, { text: '让我更懂得珍惜', trait: 'sentiment' }, { text: '还在消化中，不太清楚', trait: 'wisdom' }],
          reactions: { '让我变得更坚强了': '每一次穿越风雨，都会在心上留下一层坚韧的茧。你确实更强大了。', '让我更懂得珍惜': '悲伤是一面镜子，照出什么对我们真正重要。你学会了不再把拥有视为理所当然。', '还在消化中，不太清楚': '没关系。有些记忆需要更长的时间才能找到它在你生命中的位置。不急。' }
        }
      ],
      reflection: '悲伤的记忆不是你的伤口，而是你穿越风雨的勋章。\n\n它教会了你如何在黑暗中找到方向，也让你更懂得珍惜光明。谢谢你愿意跟我分享这段经历。'
    }
  ],
  excited: [
    {
      greeting: '{title}！说起这个你整个人都亮起来了！\n\n{year} 年的那一天，一定有什么特别的事情发生吧？快跟我说说！',
      turns: [
        {
          question: '那天你最大的感受是什么？是那种"终于来了"的兴奋，还是"天啊这真的发生了"的惊喜？',
          options: [{ text: '"终于来了"的期待成真', trait: 'courage' }, { text: '"太意外了"的惊喜', trait: 'sentiment' }, { text: '两种都有', trait: 'ratio' }],
          reactions: { '"终于来了"的期待成真': '等待的终点是最甜美的。你所有的期待在那一天都得到了回应。', '"太意外了"的惊喜': '意外的惊喜最让人难忘，因为它们像是命运给你的礼物。', '两种都有': '期待已久的意外——这是最让人心动的组合！你的记忆里有这样一颗闪亮的星星。' }
        },
        {
          question: '那天之后，你的生活有什么变化吗？哪怕是很小的改变。',
          options: [{ text: '那是一个转折点', trait: 'wisdom' }, { text: '它给了我新的动力', trait: 'courage' }, { text: '只是开心的回忆', trait: 'sentiment' }],
          reactions: { '那是一个转折点': '人生的轨迹往往被这样的时刻改变。你当时或许没有意识到，但回头看，一切都不一样了。', '它给了我新的动力': '热情是最好的燃料。那天的能量一直延续到了今天。', '只是开心的回忆': '有些记忆不需要有"意义"，它们的存在本身就是意义——你曾经那么快乐过。' }
        },
        {
          question: '如果给那天的兴奋程度打分（1-10分），你打几分？',
          options: [{ text: '10分！满分！', trait: 'sentiment' }, { text: '八九分吧', trait: 'ratio' }, { text: '那时候很容易满足', trait: 'wisdom' }],
          reactions: { '10分！满分！': '满分！我能感受到那种毫无保留的快乐——那种感觉就像是整个世界都在为你喝彩。', '八九分吧': '留一点余地的满分，才是最真实的。你既享受了那一刻，又保持了一分清醒。', '那时候很容易满足': '那时候的你，更容易被生活打动。那个你也值得被记住。' }
        }
      ],
      reflection: '兴奋的记忆像是生命中的烟火——灿烂、短暂，但永远留在心底。\n\n它们提醒着你：你曾如此热烈地活过，如此全然地期待过。这种能力，依然在你身上。'
    }
  ],
  peaceful: [
    {
      greeting: '{title}……念出这个名字的时候，你的呼吸似乎都变得平缓了。\n\n那是 {year} 年一个宁静的片段吧？跟我描述一下那个画面。',
      turns: [
        {
          question: '当时你在做什么？是一个人的安静时光，还是沉浸在某种氛围里？',
          options: [{ text: '独处，享受安静', trait: 'wisdom' }, { text: '沉浸在自然或音乐里', trait: 'sentiment' }, { text: '和某人无言地相处', trait: 'courage' }],
          reactions: { '独处，享受安静': '独处是一种能力。你懂得如何跟自己相处，这是一件了不起的事。', '沉浸在自然或音乐里': '那种被美好的事物包围的感觉——像是世界暂时为你按下了暂停键。', '和某人无言地相处': '最深的默契是不需要语言的。能一起安静的人，一定懂彼此。' }
        },
        {
          question: '那时候你心里有没有在想什么？还是说，脑袋里是空空的，只是纯粹地"在"那里？',
          options: [{ text: '在想生活中的事情', trait: 'ratio' }, { text: '什么也没想，只是感受', trait: 'wisdom' }, { text: '在感恩那一刻的美好', trait: 'sentiment' }],
          reactions: { '在想生活中的事情': '即使在平静中，你的思绪也在编织着生活。这种动静结合，很美。', '什么也没想，只是感受': '那是真正的平静——不是没有声音，而是内心安静到可以听见一切。', '在感恩那一刻的美好': '能察觉美好并为之感恩的人，内心一定充满了温柔。' }
        },
        {
          question: '如果可以，你希望重温那一刻吗？还是说，让它留在记忆里更好？',
          options: [{ text: '想再体验一次', trait: 'sentiment' }, { text: '留在记忆里刚刚好', trait: 'wisdom' }, { text: '想带着现在的心智回去', trait: 'courage' }],
          reactions: { '想再体验一次': '有些地方，去一次是为了记住；想再去，是因为它成了你的一部分。', '留在记忆里刚刚好': '你说得对——有些记忆之所以美好，恰恰因为它们不会被重复。它们永远是完好的。', '想带着现在的心智回去': '带着今天的智慧回到过去的平静——那会是一种很奇妙的对话。' }
        }
      ],
      reflection: '平静的记忆是你内心的避风港。每当你感到疲惫，你都可以回到这些时刻里，歇一歇。\n\n它们教会你：幸福不一定是喧闹的，它也可以是午后的阳光、一杯温茶、一段什么都不做的时光。'
    }
  ],
  nostalgic: [
    {
      greeting: '{title}……你念出这个词的时候，眼神飘向了远方。\n\n{year} 年，那个已经有些模糊的时间点。是什么让你突然想起了它？',
      turns: [
        {
          question: '你觉得记忆里的那个场景，和实际发生的有多少出入？我们的大脑是不是悄悄美化了一些细节？',
          options: [{ text: '肯定美化了很多', trait: 'wisdom' }, { text: '我觉得就是那样的', trait: 'sentiment' }, { text: '有些模糊了，但感觉还在', trait: 'ratio' }],
          reactions: { '肯定美化了很多': '记忆是时光的滤镜。那些被美化的部分，其实是你内心对它们的情感——比事实更真实。', '我觉得就是那样的': '你拥有一颗忠实记录的心。或者说，那段记忆实在太深刻，连时间都无法模糊它。', '有些模糊了，但感觉还在': '感觉比细节更持久。即使记不清具体的画面，你知道那一刻自己是快乐的。' }
        },
        {
          question: '如果用一个词来形容那段时光，你会用什么？',
          options: [{ text: '单纯', trait: 'sentiment' }, { text: '热烈', trait: 'courage' }, { text: '遥远', trait: 'wisdom' }],
          reactions: { '单纯': '那时的生活比现在简单，快乐也是。这份单纯是你心底最柔软的一角。', '热烈': '你曾经那么用力地生活过，那么投入地感受过。热烈的人，回忆都是烫的。', '遥远': '是的——像是上辈子的事。但你能在这头隔着时光望过去，本身就是一种美好。' }
        },
        {
          question: '如果可以对那时候的自己说一句话，你想说什么？',
          options: [{ text: '"别着急，慢慢来"', trait: 'wisdom' }, { text: '"你真棒"', trait: 'courage' }, { text: '"我会记得这一切的"', trait: 'sentiment' }],
          reactions: { '"别着急，慢慢来"': '你对自己很温柔。那时候的你需要听到这句话。而你也确实走到了今天。', '"你真棒"': '简单的三个字，却是最有力量的认可。那时候的你值得被肯定。', '"我会记得这一切的"': '你确实记得。这就是你的承诺兑现了——从过去到现在，你一直带着它们。' }
        }
      ],
      reflection: '怀念不是留恋过去，而是你带着过去的自己一起往前走。\n\n那些泛黄的记忆碎片，拼凑起来是你来时的路。你不知道终点在哪里，但你知道——这条路，你走得认真而深情。'
    }
  ],
  proud: [
    {
      greeting: '{title}——说到这个，你的腰板都不自觉地挺直了！\n\n{year} 年，你一定做到了什么让自己骄傲的事情。来，跟我说说你的高光时刻！',
      turns: [
        {
          question: '这件事对你来说，最大的意义是什么？是结果本身，还是你为此付出的过程？',
          options: [{ text: '过程，我付出了很多努力', trait: 'courage' }, { text: '结果，它证明了什么', trait: 'ratio' }, { text: '两者都是', trait: 'sentiment' }],
          reactions: { '过程，我付出了很多努力': '真正让你骄傲的，不是那个结果，而是那个拼尽全力的自己。你为自己感到骄傲——这是最深的骄傲。', '结果，它证明了什么': '你做成了——用事实说话。那个结果像一个里程碑，告诉世界也告诉自己：我可以。', '两者都是': '完美的骄傲——你既享受了奋斗的过程，也收获了丰硕的果实。你值得每一份自豪。' }
        },
        {
          question: '当时有谁为你感到高兴吗？还是说，这是你自己心里的一场胜利？',
          options: [{ text: '有家人朋友为我高兴', trait: 'sentiment' }, { text: '主要是自己认可自己', trait: 'courage' }, { text: '既是自己骄傲，也有人分享', trait: 'ratio' }],
          reactions: { '有家人朋友为我高兴': '有人为你骄傲，你的快乐就扩大了。你身边的人一定很爱你。', '主要是自己认可自己': '最高级的骄傲是自足的——不需要别人的认可，你心里明白自己做了什么。', '既是自己骄傲，也有人分享': '最好的状态——你有内心的笃定，也有外界的温暖。你被看见，也被理解。' }
        },
        {
          question: '现在回想起来，你觉得这件事对你的自信心影响大吗？',
          options: [{ text: '很大，它改变了我看自己的方式', trait: 'courage' }, { text: '有一定影响，但不是全部', trait: 'wisdom' }, { text: '只是众多经历中的一件', trait: 'ratio' }],
          reactions: { '很大，它改变了我看自己的方式': '有些经历会重塑我们对自己的认知。你从那以后，看自己的眼光不同了。', '有一定影响，但不是全部': '你对自己的认识是全面的——一件事不会定义你，但它丰富了你。', '只是众多经历中的一件': '你经历过很多，所以你的底气来自于所有经历的累积，而不是单一事件。' }
        }
      ],
      reflection: '骄傲的记忆是你内心的勋章。它们不是炫耀的资本，而是你对自己说"我可以"的证据。\n\n每当你怀疑自己的时候，回望这些时刻——它们会告诉你：你已经走了多远。'
    }
  ],
  loved: [
    {
      greeting: '{title}……说出这个词的时候，你的表情变得好温柔。\n\n{year} 年，你被深深地爱着。那种感觉是什么样的？',
      turns: [
        {
          question: '是谁让你感受到了这份爱？还是说，是很多人的爱汇聚在一起？',
          options: [{ text: '一个人，特别的人', trait: 'sentiment' }, { text: '家人', trait: 'courage' }, { text: '朋友们的温暖', trait: 'courage' }],
          reactions: { '一个人，特别的人': '被一个人深深地爱着，是世界上最特别的感觉。那种被看见、被珍视的体验，无可替代。', '家人': '家人的爱是最不用怀疑的。它像空气一样，你可能习惯了它的存在，但没有它就无法呼吸。', '朋友们的温暖': '被朋友们爱着的感觉很温暖——不是占有，是陪伴。你被很多人放在心上。' }
        },
        {
          question: '那时你做了什么事，让你感受到"啊，我正被爱着"？还是说，只是一种弥漫的感觉？',
          options: [{ text: '具体的事情/话语', trait: 'ratio' }, { text: '一种持续的氛围', trait: 'sentiment' }, { text: '某个眼神或动作', trait: 'wisdom' }],
          reactions: { '具体的事情/话语': '那些被爱的证据，被你好好地收藏在记忆里了。它们是你情感的锚点。', '一种持续的氛围': '最深的爱是不需要具体证据的——它弥漫在空气中，你每一次呼吸都能感受到。', '某个眼神或动作': '最动人的爱往往藏在细节里——一个眼神、一个不经意的动作。你捕捉到了，你懂。' }
        },
        {
          question: '你觉得"被爱"这件事，对那时的你意味着什么？',
          options: [{ text: '让我有安全感', trait: 'courage' }, { text: '让我学会了爱别人', trait: 'sentiment' }, { text: '让我觉得自己值得', trait: 'wisdom' }],
          reactions: { '让我有安全感': '被爱是世界上最安全的感觉。有一个地方让你可以做自己。', '让我学会了爱别人': '只有被深爱过的人，才懂得如何深爱别人。你心里的爱像泉水一样流出来。', '让我觉得自己值得': '这是爱的终极礼物——它让你相信自己值得被爱。这份信念，没有任何人可以夺走。' }
        }
      ],
      reflection: '被爱的记忆是你心口的暖流。即使在最寒冷的日子里，你也能把手放在胸口，感受到那份温度。\n\n你曾被深深地爱过——这个事实不会改变。你值得所有的爱。'
    }
  ],
  grateful: [
    {
      greeting: '{title}……你说这个词的时候，眼神里有光。\n\n{year} 年，一定有什么让你心存感激的事吧。是什么让你有想要说"谢谢"的冲动？',
      turns: [
        {
          question: '你感恩的对象是某个人，还是某种际遇，或者只是命运本身？',
          options: [{ text: '一个人', trait: 'sentiment' }, { text: '一段际遇', trait: 'wisdom' }, { text: '命运或生活本身', trait: 'courage' }],
          reactions: { '一个人': '对某个人心怀感恩——这种感觉很珍贵。它说明你被善意对待过。', '一段际遇': '你感恩的不是某个人，而是整个经历。你看到了更宏观的图景。', '命运或生活本身': '对生活本身怀有感恩——这是最难得的。你有一颗温柔而辽阔的心。' }
        },
        {
          question: '你觉得这件事的发生，在多大程度上改变了你？',
          options: [{ text: '彻底改变了我的人生轨迹', trait: 'courage' }, { text: '让我变得更好了', trait: 'sentiment' }, { text: '让我明白了某个道理', trait: 'wisdom' }],
          reactions: { '彻底改变了我的人生轨迹': '有些恩情是如此厚重，它把你推向了一条完全不同的路。你的人生因此转向。', '让我变得更好了': '即使不是颠覆性的改变，那些让你变得更好的事物，同样值得深深感恩。', '让我明白了某个道理': '最好的礼物不是给予鱼，而是教会你如何捕鱼。你获得了受用终生的智慧。' }
        },
        {
          question: '如果可以，你想对那时候帮助过你的人说什么？',
          options: [{ text: '"谢谢你出现在我的生命里"', trait: 'sentiment' }, { text: '"你改变了我"', trait: 'courage' }, { text: '有些感谢放在心里', trait: 'wisdom' }],
          reactions: { '"谢谢你出现在我的生命里"': '多么美的一句话。有些人出现在你的生命里，不是为了长久停留，而是为了改变你的方向。', '"你改变了我"': '你承认了这种改变——这不是软弱，而是你对自己成长的深刻认知。', '有些感谢放在心里': '有些感谢太深了，语言反而显得轻了。你放在心里，每一次想起都是一次默默的祝福。' }
        }
      ],
      reflection: '感恩的记忆是你内心最温暖的一盏灯。它提醒你：你从来不是一个人走到今天的。\n\n每一份帮助、每一次善意、每一个"刚好出现"的瞬间——都是你生命中的星光。带着它们，继续往前走吧。'
    }
  ],
}

export function getFallbackGreeting(emotion: string, title: string, year: number): string {
  const pool = TEMPLATES[emotion] || TEMPLATES.happy
  const tpl = pool[Math.floor(Math.random() * pool.length)]
  return tpl.greeting.replace('{title}', title).replace('{year}', String(year))
}

export function getFallbackTurn(emotion: string, turnIndex: number, _memoryTitle: string): FallbackTurn | null {
  const pool = TEMPLATES[emotion] || TEMPLATES.happy
  const tpl = pool[Math.floor(Math.random() * pool.length)]
  if (turnIndex >= tpl.turns.length) return null
  return tpl.turns[turnIndex]
}

export function getFallbackReflection(emotion: string): string {
  const pool = TEMPLATES[emotion] || TEMPLATES.happy
  const tpl = pool[Math.floor(Math.random() * pool.length)]
  return tpl.reflection
}

export function getMaxTurns(emotion: string): number {
  const pool = TEMPLATES[emotion] || TEMPLATES.happy
  return pool[Math.floor(Math.random() * pool.length)].turns.length
}
