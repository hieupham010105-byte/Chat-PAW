import React, { useState, useEffect, useMemo, useRef } from "react";
import { audioStories } from "./audioStories";
import {
  PawPrint, X, Menu, Leaf, CheckCircle2, ArrowRight,
  ArrowLeft, Languages, GraduationCap, Sparkles, BookOpen,
  MessageCircle, Headphones, Clock3, Volume2, LoaderCircle,
  Send, CircleHelp, RotateCcw, Home, Award, Bot, Trash2
} from "lucide-react";

// =====================================================
// 1. TRÌNH ĐỘ
// =====================================================

const levels = {
  en: ["A1", "A2", "B1", "B2"],
  zh: ["HSK 1", "HSK 2", "HSK 3"]
};

// =====================================================
// 2. CHỦ ĐỀ
// =====================================================

const topics = {
  en: [
    { name: "Daily Life", icon: "🏡", desc: "Cuộc sống hằng ngày" },
    { name: "Travel", icon: "✈️", desc: "Du lịch và khám phá" },
    { name: "Food", icon: "🍜", desc: "Đồ ăn và nhà hàng" },
    { name: "School", icon: "📚", desc: "Trường học và học tập" },
    { name: "Family", icon: "👨‍👩‍👧", desc: "Gia đình và bạn bè" },
    { name: "Shopping", icon: "🛍️", desc: "Mua sắm và giá cả" }
  ],
  zh: [
    { name: "日常生活", icon: "🏡", desc: "Cuộc sống hằng ngày" },
    { name: "旅行", icon: "✈️", desc: "Du lịch và khám phá" },
    { name: "食物", icon: "🍜", desc: "Đồ ăn và nhà hàng" },
    { name: "学校", icon: "📚", desc: "Trường học và học tập" },
    { name: "家庭", icon: "👨‍👩‍👧", desc: "Gia đình và bạn bè" },
    { name: "购物", icon: "🛍️", desc: "Mua sắm và giá cả" }
  ]
};

// =====================================================
// 3. NGÂN HÀNG TỪ VỰNG
// Mỗi chủ đề có 30 từ riêng.
// Mỗi dòng: tiếng Việt | tiếng Anh | tiếng Trung | pinyin
// =====================================================

const rawVocabulary = {

  "Daily Life": `
nhà|house|家|jiā
phòng ngủ|bedroom|卧室|wòshì
phòng khách|living room|客厅|kètīng
nhà bếp|kitchen|厨房|chúfáng
phòng tắm|bathroom|浴室|yùshì
cửa|door|门|mén
cửa sổ|window|窗户|chuānghu
bàn|table|桌子|zhuōzi
ghế|chair|椅子|yǐzi
giường|bed|床|chuáng
đồng hồ|clock|钟|zhōng
điện thoại|phone|手机|shǒujī
máy tính|computer|电脑|diànnǎo
quần áo|clothes|衣服|yīfu
giày|shoes|鞋子|xiézi
buổi sáng|morning|早上|zǎoshang
buổi tối|evening|晚上|wǎnshang
bữa sáng|breakfast|早饭|zǎofàn
bữa trưa|lunch|午饭|wǔfàn
bữa tối|dinner|晚饭|wǎnfàn
ngủ|sleep|睡觉|shuìjiào
thức dậy|wake up|起床|qǐchuáng
đọc sách|read books|看书|kànshū
nghe nhạc|listen to music|听音乐|tīng yīnyuè
nấu ăn|cook|做饭|zuòfàn
dọn dẹp|clean|打扫|dǎsǎo
rửa tay|wash hands|洗手|xǐshǒu
tắm|take a shower|洗澡|xǐzǎo
đi bộ|walk|散步|sànbù
nghỉ ngơi|rest|休息|xiūxi
`,

  "Travel": `
du lịch|travel|旅游|lǚyóu
sân bay|airport|机场|jīchǎng
nhà ga|train station|火车站|huǒchēzhàn
khách sạn|hotel|酒店|jiǔdiàn
hộ chiếu|passport|护照|hùzhào
vé máy bay|flight ticket|机票|jīpiào
vali|suitcase|行李箱|xínglixiāng
bản đồ|map|地图|dìtú
du khách|tourist|游客|yóukè
hướng dẫn viên|tour guide|导游|dǎoyóu
bãi biển|beach|海滩|hǎitān
núi|mountain|山|shān
hòn đảo|island|岛|dǎo
thành phố|city|城市|chéngshì
đất nước|country|国家|guójiā
tàu hỏa|train|火车|huǒchē
máy bay|airplane|飞机|fēijī
xe buýt|bus|公共汽车|gōnggòng qìchē
taxi|taxi|出租车|chūzūchē
xe đạp|bicycle|自行车|zìxíngchē
đặt phòng|book a room|订房间|dìng fángjiān
khởi hành|depart|出发|chūfā
đến nơi|arrive|到达|dàodá
tham quan|visit|参观|cānguān
chụp ảnh|take photos|拍照|pāizhào
hành lý|luggage|行李|xíngli
vé|ticket|票|piào
địa chỉ|address|地址|dìzhǐ
kỳ nghỉ|holiday|假期|jiàqī
nhà hàng|restaurant|餐厅|cāntīng
`,

  "Food": `
cơm|rice|米饭|mǐfàn
mì|noodles|面条|miàntiáo
bánh mì|bread|面包|miànbāo
thịt gà|chicken|鸡肉|jīròu
thịt bò|beef|牛肉|niúròu
thịt lợn|pork|猪肉|zhūròu
cá|fish|鱼|yú
trứng|egg|鸡蛋|jīdàn
rau|vegetables|蔬菜|shūcài
trái cây|fruit|水果|shuǐguǒ
táo|apple|苹果|píngguǒ
chuối|banana|香蕉|xiāngjiāo
cam|orange|橙子|chéngzi
sữa|milk|牛奶|niúnǎi
nước|water|水|shuǐ
cà phê|coffee|咖啡|kāfēi
trà|tea|茶|chá
nước ép|juice|果汁|guǒzhī
đường|sugar|糖|táng
muối|salt|盐|yán
muỗng|spoon|勺子|sháozi
đũa|chopsticks|筷子|kuàizi
đĩa|plate|盘子|pánzi
bát|bowl|碗|wǎn
nhà hàng|restaurant|餐厅|cāntīng
thực đơn|menu|菜单|càidān
bữa ăn|meal|饭|fàn
ngon|delicious|好吃|hǎochī
đói|hungry|饿|è
khát|thirsty|渴|kě
`,

  "School": `
trường học|school|学校|xuéxiào
lớp học|classroom|教室|jiàoshì
học sinh|student|学生|xuésheng
giáo viên|teacher|老师|lǎoshī
bài học|lesson|课|kè
bài tập|homework|作业|zuòyè
sách|book|书|shū
vở|notebook|笔记本|bǐjìběn
bút|pen|笔|bǐ
bút chì|pencil|铅笔|qiānbǐ
thước kẻ|ruler|尺子|chǐzi
bảng|board|黑板|hēibǎn
bàn học|desk|书桌|shūzhuō
bài kiểm tra|test|考试|kǎoshì
kỳ thi|exam|测验|cèyàn
toán học|mathematics|数学|shùxué
tiếng Anh|English|英语|Yīngyǔ
tiếng Trung|Chinese|中文|Zhōngwén
khoa học|science|科学|kēxué
lịch sử|history|历史|lìshǐ
địa lý|geography|地理|dìlǐ
thư viện|library|图书馆|túshūguǎn
từ điển|dictionary|词典|cídiǎn
học tập|study|学习|xuéxí
đọc|read|读|dú
viết|write|写|xiě
nghe|listen|听|tīng
nói|speak|说|shuō
hỏi|ask|问|wèn
trả lời|answer|回答|huídá
`,

  "Family": `
gia đình|family|家庭|jiātíng
bố|father|爸爸|bàba
mẹ|mother|妈妈|māma
bố mẹ|parents|父母|fùmǔ
anh trai|older brother|哥哥|gēge
em trai|younger brother|弟弟|dìdi
chị gái|older sister|姐姐|jiějie
em gái|younger sister|妹妹|mèimei
ông|grandfather|爷爷|yéye
bà|grandmother|奶奶|nǎinai
con trai|son|儿子|érzi
con gái|daughter|女儿|nǚ'ér
chồng|husband|丈夫|zhàngfu
vợ|wife|妻子|qīzi
chú|uncle|叔叔|shūshu
cô|aunt|阿姨|āyí
em bé|baby|婴儿|yīng'ér
bạn bè|friends|朋友|péngyou
người thân|relatives|亲戚|qīnqi
hàng xóm|neighbor|邻居|línjū
tình yêu|love|爱|ài
hạnh phúc|happiness|幸福|xìngfú
sinh nhật|birthday|生日|shēngrì
đám cưới|wedding|婚礼|hūnlǐ
quà tặng|gift|礼物|lǐwù
giúp đỡ|help|帮助|bāngzhù
quan tâm|care|关心|guānxīn
thăm hỏi|visit|看望|kànwàng
cùng nhau|together|一起|yìqǐ
vui vẻ|happy|快乐|kuàilè
`,

  "Shopping": `
mua sắm|shopping|购物|gòuwù
cửa hàng|shop|商店|shāngdiàn
siêu thị|supermarket|超市|chāoshì
chợ|market|市场|shìchǎng
giá tiền|price|价格|jiàgé
tiền|money|钱|qián
tiền mặt|cash|现金|xiànjīn
thẻ ngân hàng|bank card|银行卡|yínhángkǎ
hóa đơn|receipt|收据|shōujù
giảm giá|discount|打折|dǎzhé
áo sơ mi|shirt|衬衫|chènshān
áo khoác|jacket|外套|wàitào
quần|trousers|裤子|kùzi
váy|skirt|裙子|qúnzi
đầm|dress|连衣裙|liányīqún
mũ|hat|帽子|màozi
túi xách|handbag|手提包|shǒutíbāo
kính mắt|glasses|眼镜|yǎnjìng
đồng hồ|watch|手表|shǒubiǎo
quà lưu niệm|souvenir|纪念品|jìniànpǐn
kích cỡ|size|尺寸|chǐcùn
màu sắc|color|颜色|yánsè
đắt|expensive|贵|guì
rẻ|cheap|便宜|piányi
mới|new|新|xīn
cũ|old|旧|jiù
thử đồ|try on|试穿|shìchuān
thanh toán|pay|付款|fùkuǎn
đổi hàng|exchange|换货|huànhuò
khách hàng|customer|顾客|gùkè
`
};

// =====================================================
// 4. TẠO CÂU HỎI TỰ ĐỘNG
// Mỗi chủ đề tạo đúng 30 câu riêng cho mỗi ngôn ngữ.
// =====================================================

const vocabularyBank = Object.fromEntries(
  Object.entries(rawVocabulary).map(([topic, raw]) => [
    topic,
    raw.trim().split("\n").map(line => line.split("|"))
  ])
);

function makeQuestions(language, topicName) {
  const words = vocabularyBank[topicName];

  return words.map((word, index) => {
    const [vi, en, zh, pinyin] = word;

    // Ba đáp án sai lấy từ ba từ khác trong cùng chủ đề.
    const distractors = [
      words[(index + 7) % 30],
      words[(index + 13) % 30],
      words[(index + 21) % 30]
    ];

    const choices = [
      { value: language === "en" ? en : zh, meaning: vi, correct: true },
      ...distractors.map(item => ({
        value: language === "en" ? item[1] : item[2],
        meaning: item[0],
        correct: false
      }))
    ];

    // Đổi vị trí đáp án đúng để không bị cố định.
    const shift = (index * 3 + 1) % 4;
    const options = [
      ...choices.slice(shift),
      ...choices.slice(0, shift)
    ];

    const answer = options.findIndex(item => item.correct);

    return {
      question: language === "en"
        ? `Choose the correct English word for: "${vi}".`
        : `请选择“${vi}”对应的中文词语。`,

      options: options.map(item => item.value),
      meanings: options.map(item => item.meaning),
      answer,

      explanation: language === "en"
        ? `Từ "${vi}" trong tiếng Anh là "${en}". Hãy ghi nhớ từ vựng này và luyện đặt câu.`
        : `Từ "${vi}" trong tiếng Trung là "${zh}" (${pinyin}). Hãy luyện đọc cả chữ Hán và phiên âm.`,

      vocabulary: { vi, en, zh, pinyin }
    };
  });
}

const quizBank = {
  en: Object.fromEntries(
    topics.en.map(item => [
      item.name,
      makeQuestions("en", item.name)
    ])
  ),

  zh: Object.fromEntries(
    topics.zh.map((item, index) => [
      item.name,
      makeQuestions("zh", topics.en[index].name)
    ])
  )
};


// =====================================================
// 4B. BÀI KIỂM TRA ĐẦU VÀO ĐA DẠNG: ĐIỀN TỪ + ĐỌC HIỂU
// =====================================================

const placementFillBank = {
  en: [
    ["If I ___ about the delay, I would have left home earlier.", "had known", "Đây là câu điều kiện hỗn hợp/loại 3: mệnh đề if dùng quá khứ hoàn thành để nói về điều đã không xảy ra trong quá khứ.", ["knew", "would know", "have known"], "Nếu tôi biết về sự chậm trễ đó, tôi đã rời nhà sớm hơn.", ["knew: quá khứ đơn, không diễn tả điều kiện trái với quá khứ; would know: không dùng would trong mệnh đề if loại này; have known: hiện tại hoàn thành, sai mốc thời gian."]],
    ["Neither the manager nor the assistants ___ available to answer the questions yesterday.", "were", "Với cấu trúc neither...nor..., động từ thường hòa hợp với chủ ngữ gần nhất. “Assistants” là số nhiều và câu ở quá khứ.", ["was", "has been", "is"], "Hôm qua cả người quản lý lẫn các trợ lý đều không sẵn sàng trả lời câu hỏi.", ["was: không hòa hợp với chủ ngữ gần nhất số nhiều; has been: hiện tại hoàn thành không phù hợp với yesterday; is: hiện tại đơn, sai thời gian."]],
    ["The report must be submitted ___ Friday at the latest.", "by", "“By Friday” nghĩa là chậm nhất vào thứ Sáu, đặt hạn cuối. “Until” diễn tả trạng thái kéo dài đến một thời điểm.", ["until", "during", "since"], "Báo cáo phải được nộp chậm nhất vào thứ Sáu.", ["until: nhấn mạnh sự kéo dài, không phải hạn chót hoàn thành; during: cần một khoảng thời gian; since: dùng với mốc bắt đầu."]],
    ["The more carefully you plan, ___ likely you are to make avoidable mistakes.", "the less", "Cấu trúc so sánh kép: the + comparative..., the + comparative...; plan càng cẩn thận thì càng ít có khả năng mắc lỗi.", ["less", "the least", "least"], "Bạn lập kế hoạch càng cẩn thận thì càng ít có khả năng mắc những lỗi có thể tránh được.", ["less: thiếu “the” trong cấu trúc so sánh kép; the least: so sánh nhất, không phù hợp; least: thiếu cấu trúc."]],
    ["I regret ___ him the confidential information; I should have kept it private.", "telling", "“Regret + V-ing” diễn tả hối tiếc về việc đã làm trong quá khứ. “Regret to do” thường dùng khi tiếc phải thông báo điều gì.", ["to tell", "tell", "told"], "Tôi hối tiếc vì đã kể cho anh ấy thông tin mật; lẽ ra tôi nên giữ kín.", ["to tell: thường là tiếc khi phải nói/ thông báo ngay lúc này; tell: thiếu cấu trúc; told: không đi trực tiếp sau regret trong nghĩa này."]],
    ["Had the researchers collected more data, their conclusion ___ more reliable.", "would have been", "Đảo ngữ điều kiện loại 3: Had + S + V3, S + would have + V3.", ["will be", "would be", "had been"], "Nếu các nhà nghiên cứu thu thập thêm dữ liệu, kết luận của họ đã đáng tin cậy hơn.", ["will be: tương lai, sai điều kiện quá khứ; would be: thiếu have + V3; had been: không tạo kết quả giả định."]],
    ["The proposal was rejected, not because it was impractical, ___ because its cost had been underestimated.", "but", "Cấu trúc tương phản song hành “not because..., but because...” = không phải vì..., mà vì...", ["and", "so", "although"], "Đề xuất bị bác bỏ không phải vì nó thiếu tính thực tế, mà vì chi phí đã bị đánh giá thấp.", ["and: nối ý bổ sung, không thể hiện sự đính chính; so: chỉ kết quả; although: cần một mệnh đề nhượng bộ."]],
    ["No sooner ___ the announcement than the audience began asking questions.", "had she made", "Đảo ngữ với “No sooner”: No sooner + had + S + V3 + than + mệnh đề quá khứ đơn.", ["she had made", "did she make", "she made"], "Ngay sau khi cô ấy đưa ra thông báo, khán giả bắt đầu đặt câu hỏi.", ["she had made: không đảo trợ động từ; did she make: sai thì và cấu trúc đi với than; she made: không đảo ngữ."]],
    ["The new policy aims to prevent personal data ___ without users’ permission.", "from being shared", "Cấu trúc prevent somebody/something from doing; dữ liệu là đối tượng bị chia sẻ nên dùng bị động V-ing.", ["to share", "being shared", "to be sharing"], "Chính sách mới nhằm ngăn dữ liệu cá nhân bị chia sẻ khi chưa có sự cho phép của người dùng.", ["to share: sai cấu trúc sau prevent; being shared: thiếu from; to be sharing: sai dạng và sai nghĩa bị động."]],
    ["Were the instructions clearer, fewer users ___ support.", "would need", "Đảo ngữ câu điều kiện loại 2: Were + S + ..., S + would + V.", ["will need", "needed", "would have needed"], "Nếu hướng dẫn rõ ràng hơn, sẽ có ít người dùng cần hỗ trợ hơn.", ["will need: điều kiện loại 1, không hợp giả định; needed: thiếu would; would have needed: điều kiện loại 3, nói về quá khứ."]]
  ],
  zh: [
    ["如果明天不下雨，我们___去爬山。", "就", "Cấu trúc điều kiện “如果……就……”: nếu... thì...; 就 đứng trước hành động/kết quả.", ["才", "又", "已经"], "Nếu ngày mai trời không mưa, chúng tôi sẽ đi leo núi.", ["才: nhấn mạnh muộn/điều kiện cần, không hợp ý kết quả thông thường; 又: lại/nữa; 已经: đã, không hợp tương lai giả định."]],
    ["他虽然很累，___还是把工作做完了。", "但是", "Cấu trúc nhượng bộ “虽然……但是……” = mặc dù... nhưng...", ["因为", "所以", "或者"], "Mặc dù rất mệt nhưng anh ấy vẫn hoàn thành công việc.", ["因为: vì, chỉ nguyên nhân; 所以: cho nên, chỉ kết quả; 或者: hoặc, chỉ lựa chọn."]],
    ["这件衣服比那件___便宜一点儿。", "更", "更 đứng trước tính từ để nhấn mạnh mức độ so sánh hơn; 比 đã thiết lập cấu trúc so sánh.", ["最", "太", "很"], "Bộ quần áo này rẻ hơn bộ kia một chút.", ["最: nhất, so sánh nhất; 太: quá, thường đi với 了; 很: rất, không diễn đạt mức so sánh trong cấu trúc này."]],
    ["我已经等了你半个小时了，你怎么___来？", "还没", "“还没” nghĩa là vẫn chưa, phù hợp với việc chờ đợi đến hiện tại mà người kia chưa đến.", ["已经", "刚才", "马上"], "Tôi đã đợi bạn nửa tiếng rồi, sao bạn vẫn chưa đến?", ["已经: đã rồi, trái với ý chưa đến; 刚才: vừa nãy, chỉ thời điểm; 马上: ngay lập tức, không hợp câu hỏi trách nhẹ."]],
    ["他对中国历史很感兴趣，常常___有关的书。", "阅读", "阅读 là đọc (sách/tài liệu), phù hợp văn phong và tân ngữ là sách về lịch sử.", ["听见", "参加", "经过"], "Anh ấy rất hứng thú với lịch sử Trung Quốc và thường đọc những cuốn sách liên quan.", ["听见: nghe thấy; 参加: tham gia; 经过: đi qua/trải qua, không kết hợp tự nhiên với 书 trong nghĩa này."]],
    ["会议___九点开始，请大家提前十分钟到。", "将于", "“将于 + thời gian + động từ” là cách diễn đạt trang trọng về một sự việc sẽ diễn ra vào thời điểm xác định.", ["已经", "从来", "正在"], "Cuộc họp sẽ bắt đầu lúc 9 giờ, mọi người vui lòng đến trước 10 phút.", ["已经: đã, không hợp sự kiện tương lai; 从来: từ trước đến nay; 正在: đang diễn ra."]],
    ["如果你有不明白的地方，随时可以向老师___。", "请教", "请教 nghĩa là thỉnh giáo/hỏi người có chuyên môn, kết hợp tự nhiên với 向老师.", ["通知", "打扰", "解释"], "Nếu có chỗ nào chưa hiểu, bạn có thể hỏi thầy cô bất cứ lúc nào.", ["通知: thông báo; 打扰: làm phiền; 解释: giải thích, thường chủ thể giải thích chứ không phải người học đi hỏi."]],
    ["这次活动不仅增加了大家的经验，___加强了团队合作。", "而且", "Cấu trúc “不仅……而且……” = không những... mà còn...", ["或者", "因此", "虽然"], "Hoạt động lần này không những tăng thêm kinh nghiệm mà còn củng cố tinh thần hợp tác nhóm.", ["或者: hoặc; 因此: vì vậy; 虽然: mặc dù, không tạo cặp cấu trúc."]],
    ["为了保护环境，我们应该减少一次性塑料袋的___。", "使用", "使用 nghĩa là sử dụng; “减少……的使用” là kết hợp từ tự nhiên: giảm việc sử dụng túi nhựa dùng một lần.", ["发现", "经过", "安排"], "Để bảo vệ môi trường, chúng ta nên giảm việc sử dụng túi nhựa dùng một lần.", ["发现: phát hiện; 经过: đi qua/trải qua; 安排: sắp xếp, không phù hợp với 塑料袋 trong câu."]],
    ["他没有直接回答问题，而是提出了一个值得___的新观点。", "讨论", "值得 + động từ = đáng để làm gì; 讨论 (thảo luận) phù hợp với 新观点.", ["相信", "打扫", "迟到"], "Anh ấy không trả lời trực tiếp mà đưa ra một quan điểm mới đáng để thảo luận.", ["相信: tin tưởng, thường nói 值得相信 nhưng không tự nhiên với ý quan điểm cần xem xét ở đây; 打扫: dọn dẹp; 迟到: đến muộn."]]
  ]
};
const placementReadingBank = {
  en: [
    {
      passage: "Mia works at a small bookshop near the train station. She starts work at nine in the morning. During her lunch break, she often reads mystery stories. On Sundays, the shop is closed, so she visits her grandmother.",
      questions: [
        ["Where does Mia work?", ["At a bookshop", "At a hospital", "At a school", "At a station"], 0, "Mia works at a small bookshop."],
        ["What does Mia usually do on Sundays?", ["She goes to work", "She visits her grandmother", "She takes a train", "She studies at school"], 1, "The passage says she visits her grandmother on Sundays."]
      ]
    },
    {
      passage: "Last summer, Daniel and his family travelled to a village by the sea. They stayed in a small hotel for five days. Every morning, Daniel went swimming while his sister took photographs. They enjoyed the local food and returned home by train.",
      questions: [
        ["How long did the family stay at the hotel?", ["Two days", "Three days", "Five days", "A week"], 2, "They stayed for five days."],
        ["How did the family return home?", ["By bus", "By car", "By plane", "By train"], 3, "They returned home by train."]
      ]
    },
    {
      passage: "Many people think that learning a language requires several hours of study every day. However, short and regular practice can also be effective. For example, learners can review vocabulary on the bus, listen to a short podcast, or write a few sentences before going to bed. The most important thing is consistency.",
      questions: [
        ["What is the main idea of the passage?", ["Only long lessons are useful", "Regular short practice can help language learning", "Podcasts are better than books", "People should study only at night"], 1, "The passage emphasizes short, regular and consistent practice."],
        ["Which activity is NOT mentioned?", ["Reviewing vocabulary on the bus", "Listening to a podcast", "Writing sentences", "Watching a film at the cinema"], 3, "Going to the cinema is not mentioned."]
      ]
    },
    {
      passage: "A city council introduced a bike-sharing programme to reduce traffic and air pollution. At first, only a few residents used the bicycles. After the city built more cycling lanes and lowered the rental price, the number of users increased. The council is now considering adding more stations near schools and offices.",
      questions: [
        ["Why did the city introduce the programme?", ["To attract tourists", "To reduce traffic and pollution", "To replace all buses", "To build more roads"], 1, "The stated goals were reducing traffic and air pollution."],
        ["What helped increase the number of users?", ["More cycling lanes and a lower price", "Fewer bicycle stations", "Higher rental prices", "Closing nearby schools"], 0, "Usage increased after more lanes were built and prices were lowered."]
      ]
    },
    {
      passage: "Some researchers argue that creativity grows when people are exposed to different perspectives. A team with members from varied backgrounds may approach a problem in several ways. However, diversity alone does not guarantee good results. Team members also need to listen carefully, explain their ideas clearly, and agree on shared goals.",
      questions: [
        ["According to the passage, what can different perspectives encourage?", ["Faster meetings", "Creative approaches to problems", "Less communication", "Identical opinions"], 1, "Different perspectives may help a team approach problems in several ways."],
        ["What else does a successful team need besides diverse backgrounds?", ["Shared goals and good communication", "A strict rule against discussion", "Members with identical experiences", "No disagreement"], 0, "The passage highlights listening, clear explanations and shared goals."]
      ]
    }
  ],
  zh: [
    {
      passage: "小明住在北京。他每天早上七点起床，八点坐公共汽车去学校。下午放学以后，他常常和朋友一起打篮球。星期天，他喜欢在家看书。",
      questions: [
        ["小明几点起床？", ["六点", "七点", "八点", "九点"], 1, "文章说小明每天早上七点起床。"],
        ["星期天小明喜欢做什么？", ["打篮球", "去学校", "看书", "坐公共汽车"], 2, "文章最后一句说他星期天喜欢在家看书。"]
      ]
    },
    {
      passage: "上个星期，丽丽和妈妈去超市买东西。她们买了苹果、牛奶和面包。回家的时候，天气下雨了，所以她们坐出租车回家。",
      questions: [
        ["丽丽和谁去超市？", ["爸爸", "朋友", "妈妈", "老师"], 2, "文章说丽丽和妈妈一起去超市。"],
        ["她们怎么回家？", ["坐出租车", "坐公共汽车", "走路", "坐火车"], 0, "因为下雨，她们坐出租车回家。"]
      ]
    },
    {
      passage: "现在越来越多的人喜欢运动。运动可以让身体更健康，也可以帮助人们放松。小王每天晚上跑步半个小时，周末有时候和朋友去游泳。他觉得运动以后睡得更好。",
      questions: [
        ["运动有什么好处？", ["让人更忙", "让身体更健康", "让人不需要睡觉", "让天气变好"], 1, "文章提到运动可以让身体更健康。"],
        ["小王每天晚上做什么？", ["游泳", "看电视", "跑步", "做饭"], 2, "小王每天晚上跑步半个小时。"]
      ]
    },
    {
      passage: "学校附近新开了一家图书馆。图书馆有很多中文和英文书，也有电脑可以使用。学生可以免费借书，但是必须在两周以内还书。很多学生放学以后去那里学习。",
      questions: [
        ["学生可以在图书馆做什么？", ["免费借书", "买衣服", "吃晚饭", "踢足球"], 0, "文章说学生可以免费借书。"],
        ["学生必须什么时候还书？", ["一天以内", "一周以内", "两周以内", "一个月以内"], 2, "借来的书必须在两周以内归还。"]
      ]
    },
    {
      passage: "有些人认为学习新语言最重要的是记住很多单词。其实，单词只是学习的一部分。学习者还应该多听、多说，并且在真实的生活中使用语言。犯错误并不可怕，因为我们可以从错误中学习。",
      questions: [
        ["文章认为学习语言还需要做什么？", ["只背单词", "多听、多说和实际使用", "避免和别人交流", "每天只写汉字"], 1, "文章建议多听、多说，并在生活中使用语言。"],
        ["作者怎么看待犯错误？", ["错误没有帮助", "犯错很可怕", "可以从错误中学习", "应该停止学习"], 2, "最后一句明确指出可以从错误中学习。"]
      ]
    }
  ]
};


// 10 câu nâng cao riêng cho bài kiểm tra đầu vào (không dùng câu dịch từ đơn giản).
const placementAdvancedBank = {
  en: [
    { q:"Although the instructions were lengthy, they were clear enough for most users to follow.", prompt:"What does “lengthy” mean in this sentence?", options:["Very long","Difficult to understand","Unnecessary","Recently updated"], answer:0, translation:"Mặc dù hướng dẫn khá dài, chúng vẫn đủ rõ ràng để hầu hết người dùng làm theo.", explanation:"“Lengthy” có nghĩa là dài, kéo dài về độ dài hoặc thời lượng. Ngữ cảnh đối lập “lengthy” với “clear enough”, không có nghĩa là khó hiểu.", meanings:["rất dài","khó hiểu","không cần thiết","vừa được cập nhật"], reasons:["Đúng: lengthy đồng nghĩa với long.","Difficult to understand là khó hiểu; câu nói hướng dẫn vẫn rõ ràng.","Unnecessary là không cần thiết, không nói về độ dài.","Recently updated là vừa cập nhật, không liên quan."] },
    { q:"If the team had tested the software earlier, it ___ the problem before launch.", prompt:"Choose the correct verb phrase.", options:["would have detected","will detect","would detect","had detected"], answer:0, translation:"Nếu nhóm đã kiểm thử phần mềm sớm hơn, họ đã phát hiện được vấn đề trước khi ra mắt.", explanation:"Đây là câu điều kiện loại 3: If + past perfect, would have + past participle. Cả điều kiện và kết quả đều trái với thực tế trong quá khứ.", meanings:["đã có thể phát hiện","sẽ phát hiện","sẽ phát hiện (giả định hiện tại)","đã phát hiện"], reasons:["Đúng: đúng cấu trúc kết quả điều kiện loại 3.","Will detect diễn tả tương lai, không phù hợp điều kiện quá khứ.","Would detect thường dùng cho giả định hiện tại/tương lai.","Had detected cần một mệnh đề khác làm mốc quá khứ, không phải kết quả giả định."] },
    { q:"The manager insisted that every application ___ before Friday.", prompt:"Choose the grammatically correct form.", options:["be reviewed","is reviewed","was reviewing","has reviewed"], answer:0, translation:"Người quản lý yêu cầu mọi đơn đăng ký phải được xem xét trước thứ Sáu.", explanation:"Sau insist that trong cấu trúc giả định trang trọng, dùng động từ nguyên mẫu; vì application nhận hành động nên dùng bị động “be reviewed”.", meanings:["được xem xét (dạng giả định bị động)","được xem xét (hiện tại đơn)","đang xem xét (quá khứ tiếp diễn)","đã xem xét"], reasons:["Đúng: subjunctive sau insist that, dạng bị động.","Is reviewed là hiện tại đơn, không dùng trong cấu trúc giả định này.","Was reviewing chủ động và sai nghĩa.","Has reviewed là chủ động, ứng dụng không tự xem xét."] },
    { q:"The article presents a balanced account; ___, it acknowledges the limitations of the study.", prompt:"Choose the best linking phrase.", options:["moreover","nevertheless","otherwise","instead of"], answer:0, translation:"Bài viết trình bày một góc nhìn cân bằng; hơn nữa, nó thừa nhận những hạn chế của nghiên cứu.", explanation:"Moreover bổ sung một ý hỗ trợ cho ý trước. Vế sau tiếp tục nêu một đặc điểm tích cực của bài viết.", meanings:["hơn nữa","tuy nhiên","nếu không thì","thay vì"], reasons:["Đúng: bổ sung thông tin cùng hướng.","Nevertheless diễn tả tương phản.","Otherwise diễn tả hệ quả nếu không.","Instead of cần theo sau bởi danh từ hoặc V-ing để chỉ sự thay thế."] },
    { q:"The museum, ___ was renovated last year, attracts thousands of visitors.", prompt:"Choose the correct relative pronoun.", options:["which","where","whose","what"], answer:0, translation:"Bảo tàng, nơi đã được cải tạo vào năm ngoái, thu hút hàng nghìn khách tham quan.", explanation:"Which thay thế cho vật/sự vật và làm chủ ngữ của mệnh đề quan hệ không xác định, được ngăn bằng dấu phẩy.", meanings:["đại từ quan hệ chỉ vật","trạng từ quan hệ chỉ nơi chốn","đại từ sở hữu","đại từ mang nghĩa điều mà"], reasons:["Đúng: which thay cho the museum và làm chủ ngữ của was renovated.","Where chỉ nơi chốn, không thể làm chủ ngữ của was renovated.","Whose chỉ sở hữu.","What không dùng sau danh từ đã có để mở đầu mệnh đề quan hệ kiểu này."] },
    { q:"The company is considering ___ its customer support team.", prompt:"Choose the correct gerund or infinitive form.", options:["expanding","to expand","expand","expanded"], answer:0, translation:"Công ty đang cân nhắc việc mở rộng đội ngũ hỗ trợ khách hàng.", explanation:"Consider mang nghĩa cân nhắc thì theo sau bởi danh động từ (V-ing).", meanings:["việc mở rộng","để mở rộng","mở rộng (nguyên mẫu)","đã mở rộng"], reasons:["Đúng: consider + V-ing.","To expand không theo sau consider trong nghĩa cân nhắc.","Expand thiếu dạng V-ing.","Expanded là quá khứ phân từ, không phù hợp cấu trúc."] },
    { q:"The evidence was insufficient to ___ the claim.", prompt:"Choose the most appropriate verb.", options:["substantiate","distract","postpone","withdraw"], answer:0, translation:"Bằng chứng không đủ để chứng minh cho tuyên bố đó.", explanation:"Substantiate means provide evidence to support or prove a claim; it phù hợp với danh từ evidence.", meanings:["chứng minh bằng bằng chứng","làm xao nhãng","trì hoãn","rút lại"], reasons:["Đúng: substantiate a claim là chứng minh/làm vững chắc một tuyên bố.","Distract là làm xao nhãng.","Postpone là trì hoãn.","Withdraw là rút lại, không phải chứng minh."] },
    { q:"Not until the data was analysed ___ the pattern become apparent.", prompt:"Choose the correct inverted structure.", options:["did","had","was","has"], answer:0, translation:"Mãi đến khi dữ liệu được phân tích, quy luật mới trở nên rõ ràng.", explanation:"Not until đứng đầu câu làm đảo ngữ ở mệnh đề chính: did + subject + base verb. Vì vậy dùng “did the pattern become”.", meanings:["trợ động từ quá khứ dùng trong đảo ngữ","trợ động từ quá khứ hoàn thành","động từ be quá khứ","trợ động từ hiện tại hoàn thành"], reasons:["Đúng: Not until đầu câu yêu cầu đảo ngữ với did.","Had không phù hợp với động từ become ở dạng nguyên mẫu.","Was không tạo cấu trúc đảo ngữ này.","Has là hiện tại hoàn thành, sai mốc thời gian."] },
    { q:"The instructions were ambiguous, so users interpreted them in different ways.", prompt:"What does “ambiguous” mean?", options:["Having more than one possible meaning","Extremely detailed","Scientifically proven","Easy to remember"], answer:0, translation:"Hướng dẫn không rõ nghĩa nên người dùng diễn giải chúng theo nhiều cách khác nhau.", explanation:"Ambiguous mô tả điều gì đó có thể được hiểu theo nhiều cách, dẫn đến cách diễn giải khác nhau.", meanings:["có nhiều cách hiểu","cực kỳ chi tiết","được chứng minh khoa học","dễ ghi nhớ"], reasons:["Đúng: nhiều cách hiểu giải thích vì sao người dùng diễn giải khác nhau.","Detailed nói về mức độ chi tiết.","Scientifically proven nói về bằng chứng khoa học.","Easy to remember nói về khả năng ghi nhớ."] },
    { q:"Despite ___ several reminders, he failed to submit the form on time.", prompt:"Choose the correct form.", options:["receiving","receive","received","to receive"], answer:0, translation:"Mặc dù đã nhận được vài lời nhắc, anh ấy vẫn không nộp biểu mẫu đúng hạn.", explanation:"Despite là giới từ nên theo sau bởi danh từ hoặc V-ing. Chủ ngữ nhận lời nhắc nên receiving mang nghĩa chủ động phù hợp.", meanings:["việc nhận được","nhận (nguyên mẫu)","đã nhận (quá khứ)","để nhận"], reasons:["Đúng: despite + V-ing.","Receive là nguyên mẫu, không theo sau giới từ trực tiếp.","Received không dùng như dạng bổ ngữ ở đây.","To receive không theo sau despite."] }
  ],
  zh: [
    { q:"虽然这项工作很困难，___他没有放弃。", prompt:"请选择最合适的关联词。", options:["但是","所以","而且","或者"], answer:0, translation:"Mặc dù công việc này rất khó, nhưng anh ấy không bỏ cuộc.", explanation:"“虽然……但是……” là cặp liên từ nhượng bộ: mặc dù... nhưng...", meanings:["nhưng (dànshì)","cho nên (suǒyǐ)","hơn nữa (érqiě)","hoặc (huòzhě)"], reasons:["Đúng: tạo cặp cấu trúc với 虽然.","所以 biểu thị kết quả, không đi thành cặp nhượng bộ.","而且 dùng để bổ sung ý.","或者 dùng để nêu lựa chọn."] },
    { q:"为了赶上火车，我们不得不提前出发。 “不得不”是什么意思？", prompt:"请选择正确的意思。", options:["必须","不愿意","有机会","不可能"], answer:0, translation:"Để kịp chuyến tàu, chúng tôi buộc phải khởi hành sớm. “不得不” có nghĩa là gì?", explanation:"不得不 (bùdébù) diễn tả sự bắt buộc/không còn lựa chọn nào khác, tương đương “buộc phải”.", meanings:["bắt buộc/phải","không muốn","có cơ hội","không thể"], reasons:["Đúng: 必须 là phải, bắt buộc.","不愿意 là không sẵn lòng.","有机会 là có cơ hội.","不可能 là không thể."] },
    { q:"他把钥匙放在桌子上了。句子中的“把”有什么作用？", prompt:"请选择语法功能。", options:["引出动作的对象","表示比较","表示被动","表示时间"], answer:0, translation:"Anh ấy đã đặt chìa khóa lên bàn. “把” trong câu có chức năng gì?", explanation:"Cấu trúc 把 + tân ngữ + động từ + thành phần khác nhấn mạnh cách chủ thể xử lý/tác động lên đối tượng.", meanings:["đưa tân ngữ lên trước động từ trong câu 把","biểu thị so sánh","biểu thị bị động","biểu thị thời gian"], reasons:["Đúng: 钥匙 là đối tượng chịu tác động và đứng sau 把.","So sánh thường dùng 比.","Bị động thường dùng 被.","把 không phải từ chỉ thời gian."] },
    { q:"如果你早点告诉我，我就可以帮你了。说话人想表达什么？", prompt:"请选择最符合句意的解释。", options:["对过去情况的遗憾","对未来的计划","正在发生的动作","经常发生的习惯"], answer:0, translation:"Nếu bạn nói với tôi sớm hơn thì tôi đã có thể giúp bạn rồi. Người nói muốn diễn đạt điều gì?", explanation:"Câu giả định về việc đã không xảy ra trong quá khứ, thể hiện sự tiếc nuối vì người nói không được báo sớm.", meanings:["sự tiếc nuối về việc đã qua","kế hoạch tương lai","hành động đang diễn ra","thói quen thường xuyên"], reasons:["Đúng: câu điều kiện trái thực tế trong quá khứ.","Không nói về kế hoạch tương lai.","Không mô tả hành động đang diễn ra.","Không diễn tả thói quen."] },
    { q:"这家餐厅的服务比我想象的还要周到。 “周到”最接近哪个意思？", prompt:"请选择近义解释。", options:["考虑得很全面","速度很慢","价格很便宜","位置很远"], answer:0, translation:"Dịch vụ của nhà hàng này còn chu đáo hơn tôi tưởng. “周到” gần nghĩa nhất với từ nào?", explanation:"周到 (zhōudào) nghĩa là chu đáo, cân nhắc và chăm lo đầy đủ các khía cạnh.", meanings:["suy xét/chăm lo chu đáo","tốc độ rất chậm","giá rất rẻ","vị trí rất xa"], reasons:["Đúng: 考虑得很全面 diễn tả sự chu đáo, toàn diện.","Tốc độ chậm không phải nghĩa của 周到.","Giá rẻ nói về giá cả.","Vị trí xa nói về địa điểm."] },
    { q:"由于天气原因，航班被迫推迟了两个小时。 “由于”表示什么关系？", prompt:"请选择正确答案。", options:["原因","转折","选择","递进"], answer:0, translation:"Do nguyên nhân thời tiết, chuyến bay buộc phải hoãn hai tiếng. “由于” biểu thị quan hệ gì?", explanation:"由于 (yóuyú) có nghĩa là do/bởi vì, dùng để nêu nguyên nhân.", meanings:["nguyên nhân","tương phản","lựa chọn","tăng tiến"], reasons:["Đúng: 由于 giới thiệu nguyên nhân.","Tương phản thường dùng 但是/然而.","Lựa chọn thường dùng 或者/还是.","Tăng tiến thường dùng 不但……而且……。"] },
    { q:"这本书值得一读。 “值得”后面通常可以接什么？", prompt:"请选择正确的语法结构。", options:["动词短语","数量词","时间词","人称代词"], answer:0, translation:"Cuốn sách này đáng để đọc một lần. Sau “值得” thường có thể đi với thành phần nào?", explanation:"值得 thường kết hợp với động từ/cụm động từ để diễn tả đáng làm việc gì: 值得考虑、值得学习、值得一读。", meanings:["động từ/cụm động từ","từ chỉ số lượng","từ chỉ thời gian","đại từ nhân xưng"], reasons:["Đúng: 值得 + động từ/cụm động từ.","Lượng từ không hoàn thành cấu trúc ý nghĩa này.","Từ chỉ thời gian không phù hợp.","Đại từ nhân xưng không phải thành phần theo sau thông dụng ở đây."] },
    { q:"他不仅完成了自己的任务，___主动帮助了同事。", prompt:"请选择正确的关联词。", options:["还","却","才","否则"], answer:0, translation:"Anh ấy không những hoàn thành nhiệm vụ của mình mà còn chủ động giúp đỡ đồng nghiệp.", explanation:"“不仅……还……” là cấu trúc tăng tiến: không những... mà còn...", meanings:["còn (hái)","nhưng lại (què)","mãi mới/chỉ (cái)","nếu không thì (fǒuzé)"], reasons:["Đúng: 还 kết hợp với 不仅 để bổ sung ý tăng tiến.","却 biểu thị tương phản.","才 nhấn mạnh muộn hoặc điều kiện.","否则 nghĩa là nếu không thì."] },
    { q:"为了避免误会，请你把要求解释得更清楚一些。 “避免”是什么意思？", prompt:"请选择最接近的意思。", options:["防止","增加","接受","忘记"], answer:0, translation:"Để tránh hiểu lầm, bạn hãy giải thích yêu cầu rõ ràng hơn một chút. “避免” có nghĩa là gì?", explanation:"避免 (bìmiǎn) nghĩa là tránh hoặc ngăn điều không mong muốn xảy ra.", meanings:["ngăn tránh","tăng thêm","chấp nhận","quên"], reasons:["Đúng: 防止 nghĩa là ngăn ngừa, gần nghĩa với 避免.","增加 là tăng thêm.","接受 là chấp nhận.","忘记 là quên."] },
    { q:"只要大家互相配合，这个问题就能得到解决。句中的“只要”表示什么？", prompt:"请选择正确的逻辑关系。", options:["必要条件","原因","转折","让步"], answer:0, translation:"Chỉ cần mọi người phối hợp với nhau thì vấn đề này sẽ được giải quyết. “只要” biểu thị quan hệ logic nào?", explanation:"只要……就…… diễn tả điều kiện đủ: chỉ cần điều kiện được nêu đáp ứng thì kết quả có thể xảy ra.", meanings:["điều kiện đủ","nguyên nhân","tương phản","nhượng bộ"], reasons:["Đúng: 只要……就…… là cấu trúc điều kiện.","Nguyên nhân thường dùng 因为……所以……。","Tương phản dùng 但是/然而.","Nhượng bộ dùng 虽然……但是……。"] }
  ]
};

function buildPlacementQuestions(language, quizBank, topics) {
  const fillBank = placementFillBank[language] || [];
  const fillQuestions = fillBank.map((item, index) => {
    const [prompt, correctAnswer, explanation, distractors, sentenceTranslation, optionReasons] = item;
    const rawOptions = [correctAnswer, ...distractors];
    // Xáo trộn có tính xác định để đáp án không luôn nằm ở cùng một vị trí.
    const shift = (index * 3 + 1) % 4;
    const options = [...rawOptions.slice(shift), ...rawOptions.slice(0, shift)];
    const answer = options.indexOf(correctAnswer);
    const reasonsByOption = {};
    reasonsByOption[correctAnswer] = explanation;
    distractors.forEach((option, i) => { reasonsByOption[option] = optionReasons[i]; });

    return {
      type: "fill",
      language,
      section: language === "en" ? "FILL IN THE BLANK · GRAMMAR IN CONTEXT" : "选词填空 · 语法与语境",
      question: language === "en"
        ? `Choose the best answer (${index + 1}/10):`
        : `请选择最合适的答案（${index + 1}/10）：`,
      prompt,
      sentenceTranslation,
      options,
      answer,
      answerText: correctAnswer,
      explanation,
      optionReasons: reasonsByOption
    };
  });

  const readingQuestions = placementReadingBank[language].flatMap((reading, passageIndex) =>
    reading.questions.map((item, questionIndex) => ({
      type: "reading",
      language,
      passageTranslation: placementReadingPassageTranslation[language]?.[passageIndex],
      section: language === "en" ? "READING COMPREHENSION · INFERENCE" : "阅读理解 · 信息提取与推断",
      passage: reading.passage,
      question: item[0],
      options: item[1],
      answer: item[2],
      explanation: item[3],
      optionReasons: item[4] || null,
      passageLabel: language === "en"
        ? `Reading ${passageIndex + 1} · Question ${questionIndex + 1}/2`
        : `短文 ${passageIndex + 1} · 第 ${questionIndex + 1}/2 题`
    }))
  );

  const advancedQuestions = placementAdvancedBank[language].map((item, index) => ({
    type: "choice",
    language,
    section: language === "en" ? "ADVANCED VOCABULARY & GRAMMAR" : "进阶词汇与语法",
    question: item.prompt,
    prompt: item.q,
    sentenceTranslation: item.translation,
    options: item.options,
    answer: item.answer,
    explanation: item.explanation,
    optionReasons: Object.fromEntries(item.options.map((option, optionIndex) => [option, item.reasons[optionIndex]])),
    optionMeanings: Object.fromEntries(item.options.map((option, optionIndex) => [option, item.meanings[optionIndex]]))
  }));

  // Luôn giữ đúng cấu trúc 10 điền từ + 10 đọc hiểu + 10 câu nâng cao.
  return [...fillQuestions.slice(0, 10), ...readingQuestions.slice(0, 10), ...advancedQuestions.slice(0, 10)];
}

// Nghĩa tiếng Việt cho lựa chọn trong bài kiểm tra đầu vào.
const placementMeaning = {
  // English options
  "At a bookshop":"Ở một hiệu sách", "At a hospital":"Ở bệnh viện", "At a school":"Ở trường học", "At a station":"Ở nhà ga",
  "She goes to work":"Cô ấy đi làm", "She visits her grandmother":"Cô ấy thăm bà", "She takes a train":"Cô ấy đi tàu", "She studies at school":"Cô ấy học ở trường",
  "Two days":"Hai ngày", "Three days":"Ba ngày", "Five days":"Năm ngày", "A week":"Một tuần",
  "By bus":"Bằng xe buýt", "By car":"Bằng ô tô", "By plane":"Bằng máy bay", "By train":"Bằng tàu hỏa",
  "Only long lessons are useful":"Chỉ những buổi học dài mới hữu ích", "Regular short practice can help language learning":"Luyện tập ngắn và đều đặn giúp học ngôn ngữ", "Podcasts are better than books":"Podcast tốt hơn sách", "People should study only at night":"Mọi người chỉ nên học vào ban đêm",
  "Reviewing vocabulary on the bus":"Ôn từ vựng trên xe buýt", "Listening to a podcast":"Nghe podcast", "Writing sentences":"Viết câu", "Watching a film at the cinema":"Xem phim ở rạp",
  "To attract tourists":"Để thu hút khách du lịch", "To reduce traffic and pollution":"Để giảm ùn tắc và ô nhiễm", "To replace all buses":"Để thay thế toàn bộ xe buýt", "To build more roads":"Để xây thêm đường",
  "More cycling lanes and a lower price":"Nhiều làn đường xe đạp hơn và giá thuê thấp hơn", "Fewer bicycle stations":"Ít trạm xe đạp hơn", "Higher rental prices":"Giá thuê cao hơn", "Closing nearby schools":"Đóng cửa các trường học gần đó",
  "Faster meetings":"Các cuộc họp nhanh hơn", "Creative approaches to problems":"Những cách tiếp cận sáng tạo để giải quyết vấn đề", "Less communication":"Ít giao tiếp hơn", "Identical opinions":"Những ý kiến giống hệt nhau",
  "Shared goals and good communication":"Mục tiêu chung và giao tiếp hiệu quả", "A strict rule against discussion":"Quy định nghiêm cấm thảo luận", "Members with identical experiences":"Các thành viên có trải nghiệm giống hệt nhau", "No disagreement":"Không có bất đồng",
  "wake":"thức dậy (trong cụm wake up)", "goes":"đi (ngôi thứ ba số ít)", "any":"một chút / bất kỳ", "will stay":"sẽ ở lại", "since":"kể từ", "interesting":"thú vị", "finish":"hoàn thành", "had":"trợ động từ của quá khứ hoàn thành", "will be built":"sẽ được xây dựng", "being":"việc ở trong trạng thái / đang là",
  // Chinese options
  "六点":"6 giờ", "七点":"7 giờ", "八点":"8 giờ", "九点":"9 giờ", "打篮球":"chơi bóng rổ", "去学校":"đi học", "看书":"đọc sách", "坐公共汽车":"đi xe buýt",
  "爸爸":"bố", "朋友":"bạn bè", "妈妈":"mẹ", "老师":"giáo viên", "坐出租车":"đi taxi", "走路":"đi bộ", "坐火车":"đi tàu hỏa",
  "让人更忙":"khiến người ta bận hơn", "让身体更健康":"giúp cơ thể khỏe mạnh hơn", "让人不需要睡觉":"khiến người ta không cần ngủ", "让天气变好":"làm thời tiết đẹp hơn",
  "游泳":"bơi", "看电视":"xem tivi", "跑步":"chạy bộ", "做饭":"nấu ăn", "免费借书":"mượn sách miễn phí", "买衣服":"mua quần áo", "吃晚饭":"ăn tối", "踢足球":"đá bóng",
  "一天以内":"trong vòng một ngày", "一周以内":"trong vòng một tuần", "两周以内":"trong vòng hai tuần", "一个月以内":"trong vòng một tháng",
  "只背单词":"chỉ học thuộc từ vựng", "多听、多说和实际使用":"nghe nhiều, nói nhiều và sử dụng thực tế", "避免和别人交流":"tránh giao tiếp với người khác", "每天只写汉字":"chỉ viết chữ Hán mỗi ngày",
  "错误没有帮助":"Sai lầm không có ích", "犯错很可怕":"Mắc lỗi rất đáng sợ", "可以从错误中学习":"Có thể học hỏi từ sai lầm", "应该停止学习":"Nên ngừng học",
  "起床":"thức dậy (qǐchuáng)", "是":"là (shì)", "也":"cũng (yě)", "看见":"nhìn thấy (kànjiàn)", "还是":"hay là (háishi)", "所以":"cho nên (suǒyǐ)", "到":"đến (dào)", "就":"thì / liền (jiù)", "更":"hơn / càng (gèng)", "但是":"nhưng (dànshì)",
  // New advanced placement distractors and grammar choices
  "had known":"đã biết (quá khứ hoàn thành)", "knew":"biết (quá khứ đơn)", "would know":"sẽ biết", "have known":"đã biết (hiện tại hoàn thành)",
  "were":"đã/đều (quá khứ của be, số nhiều)", "was":"đã/là (quá khứ của be, số ít)", "has been":"đã từng/đã ở", "is":"là/đang (hiện tại)",
  "by":"trước hoặc chậm nhất vào", "until":"cho đến khi", "during":"trong suốt", "the less":"càng ít", "less":"ít hơn", "the least":"ít nhất", "least":"ít nhất",
  "telling":"việc kể/nói", "to tell":"để kể/nói", "tell":"kể/nói", "told":"đã kể/nói", "would have been":"đã có thể là", "will be":"sẽ là", "would be":"sẽ là (giả định)", "had been":"đã từng là",
  "but":"nhưng/mà", "and":"và", "so":"vì vậy", "although":"mặc dù", "had she made":"cô ấy vừa đưa ra (đảo ngữ)", "she had made":"cô ấy đã đưa ra", "did she make":"cô ấy đã làm", "she made":"cô ấy đã làm",
  "from being shared":"bị chia sẻ", "to share":"chia sẻ", "being shared":"đang/bị chia sẻ", "to be sharing":"để đang chia sẻ",
  "would need":"sẽ cần (giả định)", "will need":"sẽ cần", "needed":"đã cần", "would have needed":"đã cần (giả định quá khứ)",
  "才":"mãi mới / chỉ khi (cái)", "又":"lại (yòu)", "已经":"đã (yǐjīng)", "因为":"bởi vì (yīnwèi)", "或者":"hoặc (huòzhě)",
  "最":"nhất (zuì)", "太":"quá (tài)", "很":"rất (hěn)", "还没":"vẫn chưa (hái méi)", "刚才":"vừa nãy (gāngcái)", "马上":"ngay lập tức (mǎshàng)",
  "阅读":"đọc (yuèdú)", "听见":"nghe thấy (tīngjiàn)", "参加":"tham gia (cānjiā)", "经过":"đi qua/trải qua (jīngguò)",
  "将于":"sẽ vào (jiāng yú)", "从来":"từ trước đến nay (cónglái)", "正在":"đang (zhèngzài)",
  "请教":"thỉnh giáo/hỏi ý kiến (qǐngjiào)", "通知":"thông báo (tōngzhī)", "打扰":"làm phiền (dǎrǎo)", "解释":"giải thích (jiěshì)",
  "而且":"hơn nữa/mà còn (érqiě)", "因此":"do đó (yīncǐ)", "使用":"sử dụng (shǐyòng)", "发现":"phát hiện (fāxiàn)", "安排":"sắp xếp (ānpái)",
  "讨论":"thảo luận (tǎolùn)", "相信":"tin tưởng (xiāngxìn)", "打扫":"quét dọn (dǎsǎo)", "迟到":"đến muộn (chídào)"

};

const placementSentenceTranslation = {
  "I usually ___ up at six every morning.":"Tôi thường thức dậy lúc sáu giờ mỗi buổi sáng.",
  "She ___ to school by bus every day.":"Cô ấy đi học bằng xe buýt mỗi ngày.",
  "There isn't ___ milk left in the fridge.":"Không còn chút sữa nào trong tủ lạnh.",
  "If it rains tomorrow, we ___ at home.":"Nếu ngày mai trời mưa, chúng tôi sẽ ở nhà.",
  "I have lived here ___ 2021.":"Tôi đã sống ở đây kể từ năm 2021.",
  "The book was so ___ that I finished it in one day.":"Cuốn sách thú vị đến mức tôi đọc xong chỉ trong một ngày.",
  "You should ___ your homework before watching TV.":"Bạn nên hoàn thành bài tập về nhà trước khi xem TV.",
  "By the time we arrived, the film ___ already started.":"Khi chúng tôi đến nơi thì bộ phim đã bắt đầu trước đó rồi.",
  "The new bridge ___ next year.":"Cây cầu mới sẽ được xây dựng vào năm tới.",
  "Despite ___ tired, she continued working.":"Mặc dù mệt, cô ấy vẫn tiếp tục làm việc.",
  "我每天早上六点___。":"Mỗi sáng tôi thức dậy lúc sáu giờ.", "他___学生。":"Anh ấy là học sinh.", "我喜欢喝茶，___喜欢喝咖啡。":"Tôi thích uống trà, cũng thích uống cà phê.",
  "昨天我___了一个朋友。":"Hôm qua tôi đã gặp một người bạn.", "你想喝茶___咖啡？":"Bạn muốn uống trà hay cà phê?", "因为今天下雨，___我不出去。":"Vì hôm nay trời mưa nên tôi không ra ngoài.",
  "从我家___学校要走十分钟。":"Từ nhà tôi đến trường đi bộ mất mười phút.", "如果明天有时间，我___去图书馆。":"Nếu ngày mai có thời gian, tôi sẽ đi thư viện.",
  "这本书比那本书___有意思。":"Quyển sách này thú vị hơn quyển kia.", "虽然他很忙，___他还是帮助了我。":"Mặc dù anh ấy rất bận, nhưng vẫn giúp tôi."
};

const placementReadingPassageTranslation = {
  en: [
    "Mia làm việc tại một hiệu sách nhỏ gần ga tàu. Cô bắt đầu làm lúc 9 giờ sáng. Trong giờ nghỉ trưa, cô thường đọc truyện trinh thám. Chủ nhật hiệu sách đóng cửa nên cô đến thăm bà.",
    "Mùa hè năm ngoái, Daniel và gia đình đi du lịch đến một ngôi làng ven biển. Họ ở khách sạn nhỏ trong năm ngày. Mỗi sáng Daniel đi bơi còn chị/em gái chụp ảnh. Họ thưởng thức món ăn địa phương và trở về nhà bằng tàu hỏa.",
    "Nhiều người nghĩ rằng học ngôn ngữ cần vài giờ mỗi ngày. Tuy nhiên, việc luyện tập ngắn nhưng đều đặn cũng hiệu quả. Người học có thể ôn từ trên xe buýt, nghe podcast ngắn hoặc viết vài câu trước khi ngủ. Điều quan trọng nhất là sự kiên trì.",
    "Hội đồng thành phố triển khai chương trình chia sẻ xe đạp để giảm ùn tắc và ô nhiễm không khí. Ban đầu chỉ ít cư dân sử dụng. Sau khi thành phố xây thêm làn đường xe đạp và giảm giá thuê, số người dùng tăng lên. Hội đồng đang cân nhắc mở thêm trạm gần trường học và văn phòng.",
    "Một số nhà nghiên cứu cho rằng sự sáng tạo phát triển khi con người tiếp xúc với nhiều góc nhìn khác nhau. Nhóm có thành viên từ nhiều nền tảng có thể tiếp cận vấn đề theo nhiều cách. Tuy nhiên, sự đa dạng thôi chưa đủ; các thành viên còn cần lắng nghe, trình bày rõ ràng và thống nhất mục tiêu chung."
  ],
  zh: [
    "Tiểu Minh sống ở Bắc Kinh. Mỗi sáng cậu thức dậy lúc 7 giờ, 8 giờ đi xe buýt đến trường. Sau giờ học buổi chiều, cậu thường chơi bóng rổ cùng bạn. Chủ nhật cậu thích ở nhà đọc sách.",
    "Tuần trước, Lệ Lệ cùng mẹ đi siêu thị mua đồ. Họ mua táo, sữa và bánh mì. Khi về nhà, trời đổ mưa nên họ đi taxi về.",
    "Ngày nay ngày càng nhiều người thích vận động. Tập thể dục giúp cơ thể khỏe mạnh hơn và giúp mọi người thư giãn. Tiểu Vương chạy bộ nửa tiếng mỗi tối, cuối tuần đôi khi đi bơi với bạn. Cậu thấy mình ngủ ngon hơn sau khi vận động.",
    "Một thư viện mới mở gần trường học. Thư viện có nhiều sách tiếng Trung và tiếng Anh, cũng có máy tính để sử dụng. Học sinh có thể mượn sách miễn phí nhưng phải trả trong vòng hai tuần. Nhiều học sinh đến đó học sau giờ tan trường.",
    "Một số người cho rằng điều quan trọng nhất khi học ngôn ngữ mới là ghi nhớ nhiều từ. Thực ra, từ vựng chỉ là một phần. Người học còn nên nghe nhiều, nói nhiều và sử dụng ngôn ngữ trong đời sống thực tế. Mắc lỗi không đáng sợ vì chúng ta có thể học từ lỗi sai."
  ]
};

// Nâng cấp bài tập theo chủ đề: 10 câu điền từ, 10 câu đọc hiểu,
// 10 câu từ vựng/ngữ pháp nâng cao. Dùng cùng chuẩn giải thích chi tiết
// như bài kiểm tra đầu vào, thay cho dạng hỏi nghĩa từ đơn giản.
for (const lang of ["en", "zh"]) {
  const advancedPracticeSet = buildPlacementQuestions(lang, quizBank, topics).map((item) => {
    const options = item.options || [];
    const optionMeanings = item.optionMeanings || {};
    const meanings = options.map((option) =>
      optionMeanings[option] || placementMeaning[option] || `Nghĩa: ${option}`
    );
    return {
      ...item,
      question: item.type === "fill"
        ? (lang === "en" ? "Choose the best word or phrase to complete the sentence:" : "请选择最合适的词语完成句子：")
        : item.type === "reading" ? item.question : (item.question || item.prompt),
      meanings,
      vocabulary: null
    };
  });
  for (const topicItem of topics[lang]) {
    quizBank[lang][topicItem.name] = advancedPracticeSet.map((question) => ({ ...question }));
  }
}

function getPlacementOptionMeaning(option, question) {
  return question?.optionMeanings?.[option] || placementMeaning[option] || `Nghĩa: ${option}`;
}

function getPlacementOptionReason(question, option, index) {
  if (question.optionReasons && question.optionReasons[option]) return question.optionReasons[option];
  if (index === question.answer) return question.explanation || "Phương án này phù hợp nhất với ngữ cảnh và cấu trúc câu.";
  if (question.type === "fill") {
    return question.language === "zh"
      ? "Từ này không phù hợp với nghĩa hoặc cấu trúc ngữ pháp của câu. Hãy đối chiếu vị trí từ còn thiếu với mẫu câu."
      : "Từ/cụm từ này không khớp với cấu trúc ngữ pháp hoặc ý nghĩa của câu. Hãy chú ý từ đứng trước và sau chỗ trống.";
  }
  return "Phương án này không khớp với thông tin hoặc suy luận được hỗ trợ trong đoạn văn.";
}

function normalizePlacementAnswer(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase()
    .replace(/[.,!?;:，。！？；："'“”‘’]/g, "")
    .replace(/\s+/g, " ");
}

// =====================================================
// 5. AUDIO MẪU
// =====================================================

const audioBank = {
  en: {
    "Daily Life": [
      "Good morning! How are you today?",
      "I usually wake up at seven o'clock.",
      "What do you do in your free time?",
      "I enjoy reading books and listening to music.",
      "Let's have breakfast together.",
      "I go to school every day.",
      "Today is a beautiful day.",
      "See you tomorrow!"
    ],
    Travel: [
      "Where is the nearest airport?",
      "I would like to book a hotel room.",
      "How much is a ticket to London?",
      "Could you help me, please?",
      "Where can I find a taxi?",
      "I am traveling with my family."
    ],
    Food: [
      "I would like a cup of coffee.",
      "What would you recommend?",
      "Can I see the menu, please?",
      "This food is delicious.",
      "I would like to order some noodles."
    ],
    School: [
      "What is your favorite subject?",
      "I study English every day.",
      "Could you explain this lesson?",
      "I have homework to do.",
      "Learning is a lifelong journey."
    ],
    Family: [
      "How many people are there in your family?",
      "I love spending time with my family.",
      "My parents are very kind.",
      "We often have dinner together."
    ],
    Shopping: [
      "How much does this shirt cost?",
      "Do you have a smaller size?",
      "Can I pay by credit card?",
      "I am just looking, thank you."
    ]
  },

  zh: {
    "日常生活": [
      "你好！你今天怎么样？",
      "我每天早上七点起床。",
      "你喜欢做什么？",
      "我喜欢看书和听音乐。",
      "我们一起吃早饭吧。",
      "我每天去学校。",
      "今天天气很好。",
      "明天见！"
    ],
    "旅行": [
      "机场在哪里？",
      "我想订一个房间。",
      "去北京的票多少钱？",
      "你可以帮我吗？",
      "我在哪里可以坐出租车？",
      "我和家人一起旅行。"
    ],
    "食物": [
      "我想喝一杯咖啡。",
      "你喜欢吃什么？",
      "请给我菜单。",
      "这个菜很好吃。",
      "我想吃面条。"
    ],
    "学校": [
      "你喜欢什么科目？",
      "我每天学习中文。",
      "请你解释一下。",
      "我有作业。",
      "学习很重要。"
    ],
    "家庭": [
      "你家有几个人？",
      "我爱我的家人。",
      "我的父母很好。",
      "我们常常一起吃饭。"
    ],
    "购物": [
      "这个多少钱？",
      "有小一点的吗？",
      "可以刷卡吗？",
      "我只是看看，谢谢。"
    ]
  }
};

// =====================================================
// 6. HÀM HỖ TRỢ
// =====================================================

function getDetailedGrammarNote(question, language) {
  if (language === "zh") {
    return "Hãy chú ý cách đọc chữ Hán, nghĩa của từ và cách sử dụng từ trong ngữ cảnh.";
  }

  return "Hãy ghi nhớ nghĩa của từ, cách viết và luyện sử dụng từ trong các câu giao tiếp hằng ngày.";
}

// =====================================================
// 7. COMPONENT APP
// =====================================================

export default function App() {
  const [language, setLanguage] = useState(null);
  const [level, setLevel] = useState(null);
  const [placementMode, setPlacementMode] = useState(false);
  const [placementIndex, setPlacementIndex] = useState(0);
  const [placementSelected, setPlacementSelected] = useState(null);
  const [placementTextAnswer, setPlacementTextAnswer] = useState("");
  const [placementAnswered, setPlacementAnswered] = useState(false);
  const [placementScore, setPlacementScore] = useState(0);
  const [placementFinished, setPlacementFinished] = useState(false);
  const [topic, setTopic] = useState(null);
  const [mode, setMode] = useState(null);

  const [mobileMenu, setMobileMenu] = useState(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const [rate, setRate] = useState("0.85");
  const [audioIndex, setAudioIndex] = useState(0);
  const [audioStarted, setAudioStarted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speechPassed, setSpeechPassed] = useState(false);
  const [recognizedSpeech, setRecognizedSpeech] = useState("");
  const [speechFeedback, setSpeechFeedback] = useState("");
  const [recordingUrl, setRecordingUrl] = useState("");
  const [audioBusy, setAudioBusy] = useState(false);
  const recorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  const chatEnd = useRef(null);
  const chatInput = useRef(null);
  const audioChatWindow = useRef(null);

  const selectedTopic = topic?.name || "";

  const questions = useMemo(() => {
    return quizBank[language]?.[selectedTopic] || [];
  }, [language, selectedTopic]);

  const currentQuestion = questions[questionIndex];

  // Bài kiểm tra đầu vào: lấy 5 câu từ mỗi chủ đề, tổng cộng 30 câu.
  const placementQuestions = useMemo(() => {
    if (!language) return [];
    return buildPlacementQuestions(language, quizBank, topics);
  }, [language]);

  const placementQuestion = placementQuestions[placementIndex];
  const placementLevel = language === "zh"
    ? (placementScore <= 9 ? "HSK 1" : placementScore <= 19 ? "HSK 2" : "HSK 3")
    : (placementScore <= 7 ? "A1" : placementScore <= 14 ? "A2" : placementScore <= 21 ? "B1" : "B2");

  const resetPlacement = () => {
    setPlacementIndex(0);
    setPlacementSelected(null);
    setPlacementTextAnswer("");
    setPlacementAnswered(false);
    setPlacementScore(0);
    setPlacementFinished(false);
  };

  const answerPlacementQuestion = value => {
    if (placementAnswered || !placementQuestion) return;
    setPlacementSelected(value);
    setPlacementAnswered(true);
    if (value === placementQuestion.answer) {
      setPlacementScore(old => old + 1);
    }
  };

  const nextPlacementQuestion = () => {
    if (placementIndex + 1 >= placementQuestions.length) {
      setPlacementFinished(true);
      return;
    }
    setPlacementIndex(old => old + 1);
    setPlacementSelected(null);
    setPlacementTextAnswer("");
    setPlacementAnswered(false);
  };

  const answerPlacementText = () => {
    if (placementAnswered || !placementQuestion || !placementTextAnswer.trim()) return;
    const isCorrect = normalizePlacementAnswer(placementTextAnswer) ===
      normalizePlacementAnswer(placementQuestion.answerText);
    setPlacementSelected(isCorrect);
    setPlacementAnswered(true);
    if (isCorrect) setPlacementScore(old => old + 1);
  };

  const confirmPlacementLevel = () => {
    setLevel(placementLevel);
    setPlacementMode(false);
    resetPlacement();
    resetQuiz();
  };

  const topicAliases = {
    "日常生活": "Daily Life",
    "旅行": "Travel",
    "食物": "Food",
    "学校": "School",
    "家庭": "Family",
    "购物": "Shopping",
    "Daily Life": "Daily Life",
    Travel: "Travel",
    Food: "Food",
    School: "School",
    Family: "Family",
    Shopping: "Shopping"
  };

  // Resolve the audio-story key independently from the language shown in the UI.
  const storyTopic = language === "zh"
    ? (topicAliases[selectedTopic] || selectedTopic)
    : selectedTopic;

  const audioStory = audioStories?.[storyTopic];
  const currentDialogue = audioStory?.dialogues?.[audioIndex];

  // Never silently fall back to English while Chinese is selected.
  const getDialogueText = dialogue => language === "zh"
    ? (dialogue?.zhText || "")
    : (dialogue?.text || "");
  const getDialoguePinyin = dialogue => language === "zh"
    ? (dialogue?.zhPinyin || "")
    : "";
  const currentDialogueText = getDialogueText(currentDialogue);

  // =====================================================
  // 8. CSS THIÊN NHIÊN
  // =====================================================

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

    * {
      box-sizing: border-box;
    }

    :root {
      --green: #477d54;
      --green-dark: #315c3b;
      --green-light: #e9f3e6;
      --cream: #faf9f1;
      --text: #34443a;
      --muted: #819083;
      --border: #e6eade;
    }

    body {
      margin: 0;
      font-family: 'Nunito', sans-serif;
      color: var(--text);
      background: #f6f8ef;
    }

    button, input, select {
      font: inherit;
    }

    button {
      cursor: pointer;
    }

    .app-shell {
      min-height: 100vh;
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(ellipse at 5% 10%, #e3f0d9 0%, transparent 35%),
        radial-gradient(ellipse at 95% 70%, #f3eadc 0%, transparent 30%),
        #f8f9f3;
    }

    /* Trang trí thiên nhiên: cố định hoàn toàn để tránh giật/nhảy */
    .nature-decoration {
      position: fixed;
      z-index: 0;
      pointer-events: none;
      user-select: none;
      font-size: 100px;
      line-height: 1;
      opacity: .09;
      animation: none !important;
      transition: none !important;
      will-change: auto;
    }

    .nature-decoration.left {
      left: -25px;
      top: 35%;
      transform: rotate(-20deg);
    }

    .nature-decoration.right {
      right: -20px;
      bottom: 12%;
      transform: rotate(8deg);
    }

    .topbar {
      height: 78px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 7%;
      background: rgba(255,255,255,.88);
      backdrop-filter: blur(15px);
      border-bottom: 1px solid var(--border);
      position: relative;
      z-index: 10;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 11px;
      border: 0;
      background: none;
      color: var(--green-dark);
      font-size: 23px;
      font-weight: 900;
      text-align: left;
    }

    .brand > span:last-child > span {
      color: #9ab86c;
    }

    .brand-mark {
      width: 43px;
      height: 43px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      background: #e9f3e6;
      color: var(--green);
    }

    .brand-version {
      display: block;
      font-size: 9px;
      letter-spacing: 1.5px;
      color: #93a18e;
    }

    .nav {
      display: flex;
      gap: 34px;
    }

    .nav a {
      text-decoration: none;
      color: #607263;
      font-size: 14px;
      font-weight: 800;
    }

    .nav a:hover {
      color: var(--green);
    }

    .menu-toggle {
      display: none;
      background: none;
      border: 0;
      color: var(--green);
    }

    main {
      max-width: 1160px;
      margin: auto;
      padding: 35px 24px 65px;
      position: relative;
      z-index: 1;
    }

    .hero {
      display: grid;
      grid-template-columns: 1.1fr .9fr;
      align-items: center;
      gap: 35px;
      padding: 45px 15px 65px;
    }

    .eyebrow {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #779a68;
      font-size: 11px;
      letter-spacing: 2px;
      font-weight: 900;
      margin-bottom: 16px;
    }

    .hero h1 {
      font-size: clamp(37px, 5vw, 62px);
      line-height: 1.13;
      color: #315b3c;
      margin: 0 0 20px;
      font-weight: 900;
    }

    .hero h1 span {
      color: #91ad68;
    }

    .hero-copy > p {
      color: #7b897d;
      max-width: 480px;
      line-height: 1.9;
      font-size: 15px;
    }

    .hero-points {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin-top: 25px;
      color: #628267;
      font-size: 13px;
      font-weight: 800;
    }

    .hero-points span {
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .hero-photo-wrap {
      position: relative;
      display: grid;
      place-items: center;
      min-height: 300px;
    }

    .sun-orbit {
      width: 280px;
      height: 280px;
      border-radius: 50%;
      background: linear-gradient(135deg,#e4efd4,#f3ead3);
      position: absolute;
    }

    .hero-dog {
      position: relative;
      z-index: 1;
      width: min(100%, 330px);
      height: 300px;
      object-fit: contain;
      filter: drop-shadow(0 15px 15px #526b3b20);
    }

    .photo-note {
      position: absolute;
      bottom: 0;
      right: 5%;
      background: white;
      padding: 13px 18px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--green);
      font-weight: 900;
      font-size: 12px;
      box-shadow: 0 8px 30px #506b3515;
      z-index: 2;
    }

    .panel {
      background: rgba(255,255,255,.94);
      border: 1px solid var(--border);
      border-radius: 25px;
      padding: 35px;
      box-shadow: 0 12px 45px #55704a0b;
    }

    .section-heading h2,
    .panel h2 {
      font-size: 25px;
      color: var(--green-dark);
      margin: 8px 0;
      font-weight: 900;
    }

    .section-heading p,
    .panel > p {
      color: var(--muted);
      font-size: 14px;
    }

    .language-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 28px;
    }

    .language-card {
      position: relative;
      min-height: 170px;
      padding: 25px;
      text-align: left;
      border: 1px solid var(--border);
      border-radius: 20px;
      background: #f5f9f1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      transition: .25s;
    }

    .language-card.chinese {
      background: #fff8ef;
    }

    .language-card:hover,
    .topic-card:hover,
    .level-card:hover,
    .activity-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 28px #446b4518;
    }

    .flag {
      font-size: 32px;
    }

    .language-card strong {
      color: var(--green-dark);
      font-size: 20px;
    }

    .subline {
      font-size: 12px;
      color: var(--muted);
    }

    .card-arrow {
      position: absolute;
      right: 22px;
      bottom: 22px;
      color: var(--green);
    }

    .level-options {
      display: grid;
      grid-template-columns: repeat(4,1fr);
      gap: 15px;
      margin: 30px 0;
    }

    .level-card {
      border: 1px solid var(--border);
      background: #f8faf5;
      border-radius: 18px;
      padding: 22px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      transition: .2s;
      color: var(--green-dark);
    }

    .level-icon {
      font-size: 27px;
    }

    .level-card strong {
      font-size: 21px;
    }

    .level-card small {
      color: var(--muted);
      font-size: 11px;
    }

    .selection-status {
      display: flex;
      gap: 8px;
      color: #8aa56b;
      font-size: 13px;
    }

    .topic-grid {
      display: grid;
      grid-template-columns: repeat(3,1fr);
      gap: 17px;
      margin-top: 28px;
    }

    .topic-card {
      background: #f7faf3;
      border: 1px solid var(--border);
      border-radius: 19px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      gap: 9px;
      transition: .2s;
    }

    .topic-emoji {
      font-size: 33px;
    }

    .topic-card strong {
      font-size: 17px;
      color: var(--green-dark);
    }

    .topic-card small {
      font-size: 12px;
      color: var(--muted);
    }

    .text-button {
      border: 0;
      background: transparent;
      color: #769174;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-size: 13px;
      font-weight: 800;
      padding: 7px 0;
      margin-bottom: 18px;
    }

    .text-button:hover {
      color: var(--green-dark);
    }

    .workspace-banner {
      display: flex;
      align-items: center;
      gap: 22px;
      padding: 27px;
      border-radius: 22px;
      background: linear-gradient(120deg,#e9f2e1,#f8f5e8);
      margin-bottom: 32px;
    }

    .workspace-emoji {
      font-size: 48px;
    }

    .workspace-banner h1 {
      font-size: 28px;
      color: var(--green-dark);
      margin: 0;
    }

    .workspace-banner p {
      margin: 5px 0 0;
      color: var(--muted);
      font-size: 13px;
    }

    .activity-cards {
      display: grid;
      grid-template-columns: repeat(3,1fr);
      gap: 17px;
      margin-top: 22px;
    }

    .activity-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 25px;
      text-align: left;
      transition: .2s;
      color: var(--text);
    }

    .activity-icon {
      width: 49px;
      height: 49px;
      display: grid;
      place-items: center;
      border-radius: 15px;
      margin-bottom: 19px;
    }

    .chat-icon {
      background: #edf2fa;
      color: #6688b3;
    }

    .quiz-icon {
      background: #f1f1df;
      color: #9b9d55;
    }

    .audio-icon {
      background: #f9eee7;
      color: #bd8862;
    }

    .activity-card strong {
      font-size: 17px;
      color: var(--green-dark);
    }

    .activity-card p {
      min-height: 70px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.7;
    }

    .activity-link {
      display: flex;
      align-items: center;
      gap: 7px;
      color: #779a68;
      font-size: 12px;
      font-weight: 900;
    }

    .activity-panel {
      margin-top: 15px;
      min-height: 400px;
    }

    .activity-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      margin-bottom: 25px;
    }

    .activity-toolbar .eyebrow {
      margin: 0;
    }

    .chat-box {
      max-width: 800px;
      margin: auto;
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
    }

    .chat-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 18px;
      background: #f4f8ef;
    }

    .chat-avatar {
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      border-radius: 14px;
      background: white;
      color: var(--green);
    }

    .chat-header strong {
      color: var(--green-dark);
      display: block;
    }

    .chat-header small {
      color: #829183;
      display: block;
      font-size: 11px;
    }

    .online-dot {
      width: 7px;
      height: 7px;
      display: inline-block;
      border-radius: 50%;
      background: #7dbb75;
      margin-right: 5px;
    }

    .chat-time {
      margin-left: auto;
      font-size: 11px;
      color: var(--muted);
      display: flex;
      gap: 5px;
      align-items: center;
    }

    .chat-messages {
      height: 340px;
      overflow-y: auto;
      padding: 20px;
      background: #fff;
    }

    .chat-message {
      display: flex;
      gap: 9px;
      margin-bottom: 17px;
      align-items: flex-start;
    }

    .chat-message.user {
      justify-content: flex-end;
    }

    .chat-message-avatar {
      font-size: 22px;
    }

    .chat-bubble {
      display: block;
      width: fit-content;
      max-width: min(82%, 680px);
      min-width: 0;
      flex: 0 1 auto;
      padding: 13px 16px;
      border-radius: 15px;
      background: #eff5eb;
      color: #405344;
      font-size: 14px;
      line-height: 1.7;
      overflow-wrap: break-word;
      word-break: normal;
      white-space: normal;
    }

    .chat-bubble p {
      margin: 0;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      word-break: normal;
    }

    .user .chat-bubble {
      background: #e3edda;
    }

    .listen-inline {
      border: 0;
      background: transparent;
      color: #71936d;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      margin-top: 8px;
      font-size: 11px;
      font-weight: 800;
    }

    .chat-composer {
      display: flex;
      gap: 10px;
      padding: 14px;
      border-top: 1px solid var(--border);
    }

    .chat-composer input {
      flex: 1;
      min-width: 0;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 13px;
      outline: none;
    }

    .chat-composer input:focus {
      border-color: #91b38b;
    }

    .chat-composer button {
      width: 46px;
      border: 0;
      border-radius: 12px;
      background: var(--green);
      color: white;
    }

    .chat-composer button:disabled {
      opacity: .45;
    }

    .chat-footnote {
      color: var(--muted);
      font-size: 10px;
      padding: 0 15px 13px;
    }

    .inline-error {
      padding: 10px;
      color: #ad665c;
      font-size: 12px;
    }

    .spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .quiz-area {
      max-width: 750px;
      margin: auto;
    }

    .quiz-meta {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #789176;
      font-weight: 900;
      margin-bottom: 12px;
    }

    .quiz-progress {
      height: 9px;
      border-radius: 99px;
      background: #e9eee4;
      overflow: hidden;
      margin-bottom: 30px;
    }

    .quiz-progress span {
      display: block;
      height: 100%;
      background: linear-gradient(90deg,#78a76e,#bdd18c);
      border-radius: inherit;
      transition: width .3s;
    }

    .quiz-question {
      font-size: 24px;
      line-height: 1.6;
      color: #355d3d;
      margin: 12px 0 25px;
    }

    .quiz-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .quiz-option {
      min-height: 65px;
      padding: 12px 15px;
      background: white;
      border: 1px solid var(--border);
      border-radius: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      text-align: left;
      color: #536657;
      font-size: 14px;
      transition: .2s;
      overflow-wrap: anywhere;
    }

    .quiz-option > span {
      min-width: 29px;
      height: 29px;
      display: grid;
      place-items: center;
      background: #eff4eb;
      color: #78966e;
      border-radius: 9px;
      font-weight: 900;
    }

    .quiz-option:hover:not(:disabled) {
      border-color: #94b28a;
      transform: translateY(-2px);
    }

    .quiz-option:disabled {
      cursor: default;
    }

    .quiz-option.is-correct {
      background: #edf8eb;
      border: 1px solid #7ab478;
      color: #39733e;
    }

    .quiz-option.is-wrong {
      background: #fff0ed;
      border: 1px solid #e2a097;
      color: #b5685e;
    }

    .placement-section-label {
      display: inline-flex;
      align-items: center;
      padding: 7px 11px;
      margin: 4px 0 10px;
      border-radius: 999px;
      background: #eff5e9;
      color: #6e9366;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.2px;
    }

    .placement-passage {
      padding: 20px 22px;
      margin: 14px 0 20px;
      border: 1px solid #e0ead9;
      border-left: 4px solid #8caf78;
      border-radius: 15px;
      background: #f7faf3;
      color: #536657;
      font-size: 15px;
      line-height: 1.9;
      white-space: pre-wrap;
    }

    .placement-fill-form {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 16px;
    }

    .placement-fill-input {
      flex: 1 1 260px;
      min-width: 0;
      min-height: 58px;
      padding: 14px 17px;
      border: 1px solid var(--border);
      border-radius: 14px;
      outline: none;
      background: white;
      color: #355d3d;
      font: inherit;
      font-size: 16px;
    }

    .placement-fill-input:focus {
      border-color: #83a977;
      box-shadow: 0 0 0 3px #83a97722;
    }

    .placement-fill-input:disabled {
      background: #f2f7ee;
      opacity: 1;
    }

    .placement-answer-hint {
      margin-top: 9px;
      color: #829382;
      font-size: 12px;
    }

    .quiz-explanation {
      padding: 20px;
      margin-top: 23px;
      background: #f2f7ee;
      border-radius: 17px;
      font-size: 13px;
      line-height: 1.8;
      color: #5a705d;
    }

    .quiz-explanation > strong {
      font-size: 17px;
      color: #4c8750;
    }

    .quiz-explanation p {
      margin: 9px 0;
    }

    .grammar-note {
      padding: 10px;
      border-left: 3px solid #9ab67d;
      background: #ffffff90;
    }

    .option-meanings {
      margin-top: 16px;
      padding-top: 15px;
      border-top: 1px solid #dce8d7;
    }

    .option-meaning-row {
      display: grid;
      grid-template-columns: 1fr 1.3fr auto;
      gap: 10px;
      padding: 8px 0;
      border-bottom: 1px solid #e2eadc;
      align-items: center;
      font-size: 11px;
    }

    .option-meaning-row em {
      color: #4c9453;
      font-style: normal;
      font-weight: 900;
    }

    .primary-button,
    .outline-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      border-radius: 12px;
      padding: 13px 20px;
      font-size: 13px;
      font-weight: 900;
      transition: .2s;
    }

    .primary-button {
      border: 0;
      background: #55865d;
      color: white;
    }

    .primary-button:hover {
      background: #396b43;
      transform: translateY(-2px);
    }

    .outline-button {
      background: white;
      border: 1px solid var(--border);
      color: #628267;
    }

    .quiz-next {
      margin-top: 20px;
      width: 100%;
    }

    .quiz-result {
      text-align: center;
      padding: 35px 10px;
    }

    .result-mascot {
      font-size: 70px;
    }

    .quiz-result h2 {
      color: var(--green-dark);
    }

    .result-score {
      font-size: 60px;
      font-weight: 900;
      color: #66915d;
      margin: 20px 0 5px;
    }

    .quiz-result > strong {
      display: block;
      color: #78916e;
      margin-bottom: 24px;
    }

    .audio-area {
      max-width: 700px;
      margin: auto;
    }

    .audio-intro {
      text-align: center;
    }

    .audio-intro .activity-icon {
      margin: auto;
    }

    .audio-intro h2 {
      color: var(--green-dark);
    }

    .audio-intro p {
      color: var(--muted);
      font-size: 13px;
    }

    .speech-rate {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin: 25px;
      color: #748c73;
      font-size: 13px;
    }

    .speech-rate select {
      border: 1px solid var(--border);
      padding: 8px;
      border-radius: 9px;
      background: white;
    }

    .story-dialogue {
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 25px;
      background: #fbfcf8;
    }

    .story-progress {
      font-size: 10px;
      color: #91a287;
      font-weight: 900;
    }

    .story-progress > div {
      height: 7px;
      background: #e8eee2;
      border-radius: 99px;
      overflow: hidden;
      margin-top: 10px;
    }

    .story-progress i {
      display: block;
      height: 100%;
      background: #8eb17a;
      border-radius: 99px;
    }

    .story-speaker {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 25px 0;
    }

    .story-avatar {
      font-size: 30px;
    }

    .story-speaker small,
    .story-line small,
    .story-meaning small {
      display: block;
      font-size: 10px;
      letter-spacing: 1px;
      color: #92a18c;
    }

    .story-speaker strong {
      color: var(--green-dark);
    }

    .story-line {
      padding: 20px;
      background: white;
      border-radius: 15px;
    }

    .story-line p {
      font-size: 19px;
      font-weight: 800;
      color: #486c4b;
      line-height: 1.6;
    }

    .story-meaning {
      padding: 15px 20px;
      margin-top: 12px;
      border-radius: 13px;
      background: #edf4e9;
    }

    .story-controls {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-top: 20px;
    }

    .audio-note {
      text-align: center;
      color: #99a498;
      font-size: 11px;
      margin-top: 20px;
    }

    footer {
      position: relative;
      z-index: 1;
      background: #edf3e8;
      text-align: center;
      padding: 32px 15px;
      color: #82937f;
      font-size: 12px;
    }

    .footer-brand {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 9px;
      color: var(--green-dark);
      font-size: 19px;
      font-weight: 900;
    }

    footer p {
      margin: 10px;
    }

    footer > span {
      font-size: 10px;
    }

    @media(max-width: 850px) {
      .hero {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .hero-copy > p {
        margin: auto;
      }

      .hero-points {
        justify-content: center;
      }

      .hero-photo-wrap {
        min-height: 260px;
      }

      .topic-grid {
        grid-template-columns: repeat(2,1fr);
      }

      .activity-cards {
        grid-template-columns: 1fr;
      }

      .activity-card p {
        min-height: auto;
      }
    }

    @media(max-width: 640px) {
      .topbar {
        height: 68px;
        padding: 0 18px;
      }

      .menu-toggle {
        display: block;
      }

      .nav {
        display: none;
        position: absolute;
        top: 68px;
        left: 0;
        right: 0;
        padding: 20px;
        background: white;
        flex-direction: column;
        gap: 20px;
        border-bottom: 1px solid var(--border);
      }

      .nav.open {
        display: flex;
      }

      main {
        padding: 20px 13px 40px;
      }

      .hero {
        padding: 30px 5px;
      }

      .hero h1 {
        font-size: 39px;
      }

      .hero-photo-wrap {
        min-height: 230px;
      }

      .sun-orbit {
        width: 220px;
        height: 220px;
      }

      .hero-dog {
        height: 240px;
      }

      .panel {
        padding: 22px 16px;
        border-radius: 19px;
      }

      .language-options {
        grid-template-columns: 1fr;
      }

      .level-options {
        grid-template-columns: repeat(2,1fr);
      }

      .topic-grid {
        grid-template-columns: repeat(2,1fr);
        gap: 10px;
      }

      .topic-card {
        padding: 17px 12px;
      }

      .topic-card strong {
        font-size: 14px;
      }

      .workspace-banner {
        padding: 18px 12px;
        gap: 12px;
      }

      .workspace-emoji {
        font-size: 35px;
      }

      .workspace-banner h1 {
        font-size: 22px;
      }

      .quiz-options {
        grid-template-columns: 1fr;
      }

      .quiz-question {
        font-size: 19px;
      }

      .option-meaning-row {
        grid-template-columns: 1fr;
        gap: 4px;
      }

      .chat-time {
        display: none;
      }

      .chat-messages {
        height: 300px;
        padding: 12px;
      }

      .story-dialogue {
        padding: 15px;
      }

      .activity-panel {
        padding: 17px 12px;
      }

      .nature-decoration {
        font-size: 65px;
        opacity: .10;
      }
    }

    .quiz-reading-passage { margin:18px 0; padding:18px 20px; border:1px solid #dfe9d9; border-radius:16px; background:#f7faf4; color:#526b55; line-height:1.8; }
    .quiz-reading-passage > strong { display:block; margin-bottom:8px; color:#6f9368; font-size:12px; letter-spacing:.08em; text-transform:uppercase; }
    .quiz-reading-passage p { margin:7px 0; white-space:pre-line; }
    .quiz-passage-translation { padding-top:10px; border-top:1px dashed #d8e3d2; color:#758675; font-size:14px; }
    .quiz-question-prompt { margin:8px 0 16px; color:#607963; font-weight:600; }
    .option-reason { display:block; margin-top:5px; color:#7b897b; font-size:13px; line-height:1.55; }

    .audio-practice { margin-top:18px; padding:18px; border:1px solid #e1eadb; border-radius:16px; background:#f4f8f0; color:#416c49; }
    .audio-practice > p { color:#758675; font-size:12px; line-height:1.6; }
    .audio-practice-actions { display:flex; flex-wrap:wrap; gap:9px; }
    .recognized-speech { padding:10px 12px; border-radius:10px; background:white; color:#526b53; overflow-wrap:anywhere; }
    .speech-feedback { color:#ad7650 !important; font-weight:800; font-size:12px; }
    .speech-feedback.success { color:#4d8a54 !important; }
    .audio-disclaimer { display:block; margin-top:10px; color:#98a394; font-size:10px; }

    @media(prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
      }
    }
    /* CHAT MESSAGE: prevent narrow bubbles and awkward wrapping */
    .chat-messages { width: 100%; min-width: 0; }

    .chat-message {
      display: flex;
      align-items: flex-start;
      gap: 9px;
      width: 100%;
      min-width: 0;
      margin-bottom: 17px;
    }

    .chat-message.user { justify-content: flex-end; }
    .chat-message-avatar { flex: 0 0 30px; }

    .chat-bubble {
      display: block;
      width: fit-content;
      max-width: min(82%, 680px);
      min-width: 0;
      flex: 0 1 auto;
      padding: 13px 16px;
      border-radius: 15px;
      overflow-wrap: break-word;
      word-break: normal;
      white-space: normal;
    }

    .chat-bubble p {
      margin: 0;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      word-break: normal;
      line-height: 1.65;
    }

    /* AUDIO MESSENGER */
    .audio-pinyin {
      margin: 7px 0 2px !important;
      color: #729078;
      font-size: 13px;
      line-height: 1.5;
      font-style: italic;
    }

    .audio-messenger {
      max-width: 820px;
      margin: 0 auto;
      padding: 22px;
      background: #fbfcf8;
    }

    .audio-chat-window {
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-height: 300px;
      max-height: 560px;
      overflow-y: auto;
      padding: 22px 12px;
      margin-top: 20px;
      border-radius: 16px;
      background: #fff;
      scroll-behavior: smooth;
      overscroll-behavior: contain;
      scroll-padding-bottom: 18px;
    }

    .audio-welcome {
      margin: auto;
      max-width: 390px;
      padding: 35px 15px;
      text-align: center;
      color: #71866e;
    }

    .audio-welcome-avatars {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .audio-welcome-avatars span {
      display: grid;
      width: 58px;
      height: 58px;
      place-items: center;
      border-radius: 50%;
      background: #edf5e9;
      font-size: 30px;
    }

    .audio-welcome strong {
      display: block;
      color: #416c49;
      font-size: 17px;
    }

    .audio-welcome p { font-size: 13px; line-height: 1.6; }

    .audio-chat-message {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      width: 100%;
      min-width: 0;
    }

    .audio-chat-message.character-two { flex-direction: row-reverse; }

    .audio-character-avatar {
      display: grid;
      flex: 0 0 38px;
      width: 38px;
      height: 38px;
      place-items: center;
      border-radius: 50%;
      background: #edf4e9;
      font-size: 22px;
    }

    .audio-message-content {
      display: flex;
      flex-direction: column;
      min-width: 0;
      max-width: 82%;
    }

    .character-two .audio-message-content { align-items: flex-end; }

    .audio-speaker {
      margin: 0 8px 6px;
      color: #718a70;
      font-size: 12px;
    }

    .audio-message-bubble {
      width: fit-content;
      max-width: 100%;
      padding: 13px 16px;
      border-radius: 5px 17px 17px 17px;
      background: #edf5e9;
      color: #405744;
      overflow-wrap: anywhere;
    }

    .character-two .audio-message-bubble {
      border-radius: 17px 5px 17px 17px;
      background: #e5f0ff;
    }

    .audio-message-bubble small,
    .audio-message-meaning small {
      display: block;
      color: #8b9b85;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: .7px;
    }

    .audio-message-bubble p {
      margin: 7px 0;
      font-size: 16px;
      font-weight: 700;
      line-height: 1.65;
      overflow-wrap: anywhere;
      word-break: normal;
    }

    .audio-message-meaning {
      width: 100%;
      margin-top: 7px;
      padding: 10px 13px;
      border-radius: 12px;
      background: #fff7e9;
    }

    .audio-message-meaning p {
      margin: 5px 0 0;
      color: #78674e;
      font-size: 13px;
      line-height: 1.6;
      overflow-wrap: anywhere;
    }

    .audio-controls {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-top: 20px;
    }

    .audio-controls button:disabled { cursor: not-allowed; opacity: .45; }

    .audio-complete {
      margin: 16px 0 0;
      color: #628267;
      text-align: center;
      font-size: 13px;
    }

    .audio-chat-window::-webkit-scrollbar { width: 6px; }
    .audio-chat-window::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #dce7d7;
    }

    @media (max-width: 640px) {
      .chat-bubble { max-width: 88%; }
      .audio-pinyin { font-size: 12px; }
      .audio-messenger { padding: 14px 10px; }
      .audio-chat-window { padding: 15px 8px; }
      .audio-message-content { max-width: 85%; }
      .audio-message-bubble p { font-size: 14px; }
    }


    .placement-cta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      flex-wrap: wrap;
      margin: 24px 0 18px;
      padding: 20px;
      border: 1px solid #dce9d5;
      border-radius: 18px;
      background: linear-gradient(120deg, #f0f7eb, #fffaf0);
    }
    .placement-cta strong { color: #315c3b; font-size: 15px; }
    .placement-cta p { margin: 5px 0 0; color: #819083; font-size: 12px; }
    .placement-option-review { margin-top: 18px; border-top: 1px solid #dfe9d9; padding-top: 14px; }
    .placement-option-review > strong { display: block; margin-bottom: 8px; color: #536e57; }
    .placement-option-review-row { display: grid; grid-template-columns: minmax(130px, 0.8fr) minmax(180px, 1.5fr) auto; gap: 10px; align-items: center; padding: 10px 0; border-bottom: 1px solid #e4ecdf; font-size: 13px; }
    .placement-option-review-row div { display: flex; flex-direction: column; gap: 4px; }
    .placement-option-review-row span, .placement-option-review-row small { color: #718274; line-height: 1.5; }
    .placement-option-review-row em { color: #438b53; font-style: normal; font-weight: 700; white-space: nowrap; }
    @media (max-width: 650px) { .placement-option-review-row { grid-template-columns: 1fr; gap: 5px; } }
    .placement-panel { margin-bottom: 28px; }
    .placement-panel .quiz-area > p { color: #819083; }
    @media(max-width:640px) {
      .placement-cta { align-items: stretch; }
      .placement-cta .primary-button { width: 100%; }
    }
  `;

  // =====================================================
  // 9. LẤY THỜI GIAN VIỆT NAM
  // =====================================================

  useEffect(() => {
    let active = true;

    const fetchTime = async () => {
      try {
        const response = await fetch("/api/time");

        if (!response.ok) throw new Error("Time error");

        const data = await response.json();

        if (active && data.success) {
          setTime(data.vietnam || data.time || "");
        }
      } catch {
        if (active) {
          setTime(
            new Intl.DateTimeFormat("vi-VN", {
              timeZone: "Asia/Ho_Chi_Minh",
              dateStyle: "short",
              timeStyle: "medium"
            }).format(new Date())
          );
        }
      }
    };

    fetchTime();

    const timer = setInterval(fetchTime, 60000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  // =====================================================
  // 10. CHAT TỰ ĐỘNG CUỘN
  // =====================================================

  useEffect(() => {
    chatEnd.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }, [messages, loading]);

  // Tự cuộn BÊN TRONG khung hội thoại audio tới tin nhắn mới nhất.
  // Không cuộn cả trang nên hai nút Trước / Tiếp theo luôn dễ tìm.
  useEffect(() => {
    if (!audioStarted) return;

    const chatWindow = audioChatWindow.current;
    if (!chatWindow) return;

    chatWindow.scrollTo({
      top: chatWindow.scrollHeight,
      behavior: "smooth"
    });
  }, [audioStarted, audioIndex]);

  useEffect(() => {
    if (mode === "chat" && !loading) {
      chatInput.current?.focus();
    }
  }, [mode, loading]);

  // =====================================================
  // 11. DỪNG ÂM THANH
  // =====================================================

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      try { recognitionRef.current?.stop(); } catch {}
      try { if (recorderRef.current?.state === "recording") recorderRef.current.stop(); } catch {}
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // =====================================================
  // 12. RESET
  // =====================================================

  const resetQuiz = () => {
    setQuestionIndex(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  const resetAll = () => {
    window.speechSynthesis?.cancel();

    setLanguage(null);
    setLevel(null);
    setPlacementMode(false);
    resetPlacement();
    setTopic(null);
    setMode(null);
    setMessages([]);
    setInput("");
    setError("");
    setMobileMenu(false);
    resetQuiz();
  };

  const chooseLanguage = value => {
    setLanguage(value);
    setLevel(null);
    setPlacementMode(false);
    resetPlacement();
    setTopic(null);
    setMode(null);
    setMessages([]);
    setError("");
  };

  const chooseTopic = item => {
    setTopic(item);
    setMode(null);
    setMessages([]);
    setInput("");
    setError("");
    setAudioIndex(0);
    setAudioStarted(false);
    resetQuiz();
  };

  const goBackToTopics = () => {
    window.speechSynthesis?.cancel();

    setTopic(null);
    setMode(null);
    setMessages([]);
    setInput("");
    setError("");
    resetQuiz();
  };

  // =====================================================
  // 13. GEMINI CHAT
  // =====================================================

  const startChat = () => {
    setMode("chat");
    setError("");

    setMessages([
      {
        role: "assistant",
        text: language === "zh"
          ? `你好！欢迎来到「${topic.name}」课程。我们一起练习中文吧！你想聊什么？`
          : `Hello! Welcome to "${topic.name}"! 🐾 I'm ChatPaw. Let's practice English together. What would you like to talk about?`
      }
    ]);
  };

  async function sendMessage(event) {
    event?.preventDefault();

    const text = input.trim();

    if (!text || loading) return;

    const prior = [...messages];

    setMessages(old => [
      ...old,
      { role: "user", text }
    ]);

    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text,
          language,
          level,
          topic: selectedTopic,
          history: prior.slice(-10).map(message => ({
            role: message.role === "assistant" ? "model" : "user",
            text: message.text
          }))
        })
      });

      const rawResponse = await response.text();
      let data;
      try { data = JSON.parse(rawResponse); }
      catch { throw new Error(rawResponse.slice(0, 240) || `Máy chủ trả về dữ liệu không hợp lệ (${response.status}).`); }

      if (!response.ok || data.success === false) {
        throw new Error(
          data.error || `Lỗi máy chủ (${response.status}).`
        );
      }

      const reply = data.reply || data.response || data.text ||
        data.candidates?.[0]?.content?.parts?.map(part => part.text || "").join("\n");

      if (!reply || typeof reply !== "string") {
        throw new Error("AI chưa trả về nội dung hợp lệ.");
      }

      setMessages(old => [
        ...old,
        { role: "assistant", text: reply }
      ]);

    } catch (err) {
      setError(err.message || "Không thể kết nối AI.");

      setMessages(old => [
        ...old,
        {
          role: "assistant",
          text: language === "zh"
            ? "抱歉，我现在无法连接服务器。请检查网络后再试一次。"
            : "Oops! 🐾 Mình chưa thể kết nối máy chủ. Cậu hãy kiểm tra backend và API key nhé!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // 14. PHÁT ÂM
  // =====================================================

  function speak(text) {
    if (!("speechSynthesis" in window)) {
      setError("Trình duyệt chưa hỗ trợ đọc văn bản.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = language === "zh" ? "zh-CN" : "en-US";
    utterance.rate = Number(rate);

    window.speechSynthesis.speak(utterance);
  }

  // =====================================================
  // 14A. ĐIỀU KHIỂN HỘI THOẠI AUDIO
  // =====================================================

  const stopAudioCapture = () => {
    try { recognitionRef.current?.stop(); } catch {}
    try { if (recorderRef.current?.state === "recording") recorderRef.current.stop(); } catch {}
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setRecording(false);
  };

  const normalizeSpeech = value => String(value || "").toLocaleLowerCase()
    .normalize("NFD").replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[’']/g, "").replace(/[^\\p{L}\\p{N}\\s]/gu, " ")
    .replace(/\\s+/g, " ").trim();

  // Chinese speech matching: Han characters are not separated by spaces.
  const checkSpeechMatch = (spoken, expected) => {
    const a = normalizeSpeech(spoken), b = normalizeSpeech(expected);
    if (!a || !b) return false;
    if (a === b) return true;

    if (language === "zh") {
      const compactA = a.replace(/\\s/g, "");
      const compactB = b.replace(/\\s/g, "");
      if (!compactA || !compactB) return false;
      if (compactA.includes(compactB) || compactB.includes(compactA)) return true;
      const expectedChars = Array.from(compactB);
      const spokenChars = new Set(Array.from(compactA));
      const matched = expectedChars.filter(char => spokenChars.has(char)).length;
      return matched / Math.max(expectedChars.length, 1) >= 0.72;
    }

    const aw = new Set(a.split(" "));
    const bw = b.split(" ");
    return bw.filter(word => aw.has(word)).length / Math.max(bw.length, 1) >= 0.72;
  };

  const startAudio = () => {
    if (!audioStory?.dialogues?.length) return;
    window.speechSynthesis?.cancel();
    stopAudioCapture();
    setAudioIndex(0);
    setSpeechPassed(false);
    setRecognizedSpeech("");
    setSpeechFeedback("");
    setAudioStarted(true);
    speak(getDialogueText(audioStory.dialogues[0]));
  };

  const nextAudio = () => {
    if (!audioStarted || !speechPassed) return;
    stopAudioCapture();
    if (audioIndex < audioStory.dialogues.length - 1) {
      const nextIndex = audioIndex + 1;
      setAudioIndex(nextIndex);
      setSpeechPassed(false);
      setRecognizedSpeech("");
      setSpeechFeedback("");
      speak(getDialogueText(audioStory.dialogues[nextIndex]));
    } else {
      window.speechSynthesis?.cancel();
      setAudioStarted(false);
      setAudioIndex(0);
      setSpeechPassed(false);
    }
  };

  const previousAudio = () => {
    if (audioIndex <= 0) return;
    stopAudioCapture();
    const previousIndex = audioIndex - 1;
    window.speechSynthesis?.cancel();
    setAudioIndex(previousIndex);
    setSpeechPassed(false);
    setRecognizedSpeech("");
    setSpeechFeedback("");
    speak(getDialogueText(audioStory.dialogues[previousIndex]));
  };

  const startRecording = async () => {
    if (!currentDialogue || recording || audioBusy) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || !navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setSpeechFeedback("Trình duyệt chưa hỗ trợ ghi âm/nhận diện giọng nói. Cậu hãy thử Chrome hoặc Edge trên localhost/HTTPS nhé.");
      return;
    }
    try {
      setAudioBusy(true);
      setSpeechFeedback("");
      setRecognizedSpeech("");
      window.speechSynthesis?.cancel();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = e => { if (e.data?.size) recordedChunksRef.current.push(e.data); };
      recorder.onstop = () => {
        if (recordedChunksRef.current.length) {
          const blob = new Blob(recordedChunksRef.current, { type: recorder.mimeType || "audio/webm" });
          const url = URL.createObjectURL(blob);
          setRecordingUrl(old => { if (old) URL.revokeObjectURL(old); return url; });
        }
        stream.getTracks().forEach(track => track.stop());
        if (streamRef.current === stream) streamRef.current = null;
      };
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = language === "zh" ? "zh-CN" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;
      recognition.onresult = event => {
        const transcript = Array.from(event.results).map(r => r[0]?.transcript || "").join(" ").trim();
        setRecognizedSpeech(transcript);
        const passed = checkSpeechMatch(transcript, currentDialogueText);
        setSpeechPassed(passed);
        setSpeechFeedback(passed
          ? "Tốt lắm! Nội dung đã khá khớp với câu mẫu. Cậu có thể tiếp tục."
          : "Nội dung chưa khớp đủ với câu mẫu. Hãy nghe lại và thử lần nữa nhé.");
      };
      recognition.onerror = event => setSpeechFeedback(event.error === "not-allowed"
        ? "Micro chưa được cấp quyền. Hãy cho phép trình duyệt sử dụng micro."
        : "Chưa nhận diện được giọng nói. Cậu thử ghi âm lại nhé.");
      recognition.onend = () => setRecording(false);
      recorder.start();
      recognition.start();
      setRecording(true);
      setSpeechFeedback("Đang nghe... Cậu hãy đọc câu mẫu thành tiếng.");
    } catch (err) {
      stopAudioCapture();
      setSpeechFeedback(err?.name === "NotAllowedError"
        ? "Cậu chưa cấp quyền sử dụng micro cho trang web."
        : "Không thể mở micro. Hãy kiểm tra thiết bị và quyền truy cập micro nhé.");
    } finally { setAudioBusy(false); }
  };

  const stopRecording = () => {
    try { recognitionRef.current?.stop(); } catch {}
    try { if (recorderRef.current?.state === "recording") recorderRef.current.stop(); } catch {}
    setRecording(false);
  };

  // 15. XỬ LÝ BÀI TẬP
  // =====================================================

  const answerQuestion = value => {
    if (answered || !currentQuestion) return;

    const correct = value === currentQuestion.answer;

    setSelected(value);
    setAnswered(true);

    if (correct) {
      setScore(old => old + 1);
    }
  };

  const nextQuestion = () => {
    if (questionIndex + 1 >= questions.length) {
      setFinished(true);
      return;
    }

    setQuestionIndex(old => old + 1);
    setSelected(null);
    setAnswered(false);
  };

  // =====================================================
  // 16. GIAO DIỆN
  // =====================================================

  return (
    <div className="app-shell">

      <style>{styles}</style>

      {/* TRANG TRÍ THIÊN NHIÊN */}

      <div className="nature-decoration left">🌿</div>
      <div className="nature-decoration right">🌸</div>

      {/* HEADER */}

      <header className="topbar">

        <button className="brand" onClick={resetAll}>
          <span className="brand-mark">
            <PawPrint size={25} />
          </span>

          <span>
            Chat<span>Paw</span>
            <small className="brand-version">
              2.0 SMART LEARNING
            </small>
          </span>
        </button>

        <nav className={mobileMenu ? "nav open" : "nav"}>
          <a href="#home" onClick={() => {
            resetAll();
            setMobileMenu(false);
          }}>
            Trang chủ
          </a>

          <a href="#learning" onClick={() => setMobileMenu(false)}>
            Học tập
          </a>

          <a href="#about" onClick={() => setMobileMenu(false)}>
            Giới thiệu
          </a>
        </nav>

        <button
          className="menu-toggle"
          onClick={() => setMobileMenu(old => !old)}
          aria-label="Mở menu"
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>

      </header>

      <main id="home">

        {/* HERO */}

        {!language && (
          <section className="hero">

            <div className="hero-copy">

              <div className="eyebrow">
                <Leaf size={16} />
                LEARN • EXPLORE • GROW
              </div>

              <h1>
                Học ngoại ngữ
                <br />
                <span>theo cách của bạn!</span>
              </h1>

              <p>
                Trò chuyện cùng AI, luyện tập theo trình độ
                và nghe phát âm mẫu. ChatPaw đồng hành cùng
                bạn từng bước.
              </p>

              <div className="hero-points">
                <span>
                  <CheckCircle2 size={16} />
                  AI hội thoại nhiều lượt
                </span>

                <span>
                  <CheckCircle2 size={16} />
                  Bài tập 30 câu mỗi chủ đề
                </span>
              </div>

            </div>

            <div className="hero-photo-wrap">

              <div className="sun-orbit" />

              <img
                className="hero-dog"
                src="/images/chatpaw-dog.jpg"
                alt="Mascot ChatPaw"
                onError={e => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <div className="photo-note">
                <PawPrint size={18} />
                Hello, language learner!
              </div>

            </div>

          </section>
        )}

        {/* CHỌN NGÔN NGỮ */}

        {!language ? (

          <section className="panel language-panel" id="learning">

            <div className="section-heading">

              <div className="eyebrow">
                <Languages size={15} />
                YOUR LEARNING JOURNEY
              </div>

              <h2>Hôm nay bạn muốn học ngôn ngữ nào?</h2>

              <p>
                Chọn ngôn ngữ để cá nhân hóa bài học và hội thoại.
              </p>

            </div>

            <div className="language-options">

              <button
                className="language-card english"
                onClick={() => chooseLanguage("en")}
              >
                <span className="flag">🇬🇧</span>
                <strong>Tiếng Anh</strong>
                <span className="subline">A1 · A2 · B1 · B2</span>
                <span className="card-arrow">
                  <ArrowRight size={18} />
                </span>
              </button>

              <button
                className="language-card chinese"
                onClick={() => chooseLanguage("zh")}
              >
                <span className="flag">🇨🇳</span>
                <strong>Tiếng Trung</strong>
                <span className="subline">HSK 1 · HSK 2 · HSK 3</span>
                <span className="card-arrow">
                  <ArrowRight size={18} />
                </span>
              </button>

            </div>

          </section>

        ) : placementMode ? (

          /* KIỂM TRA TRÌNH ĐỘ ĐẦU VÀO 30 CÂU */

          <section className="panel placement-panel">
            <button
              className="text-button"
              onClick={() => {
                setPlacementMode(false);
                resetPlacement();
              }}
            >
              <ArrowLeft size={16} /> Quay lại chọn trình độ
            </button>

            {!placementFinished ? (
              <div className="quiz-area">
                <div className="eyebrow">
                  <GraduationCap size={16} />
                  PLACEMENT TEST · {language === "en" ? "ENGLISH" : "中文"}
                </div>
                <h2>Kiểm tra trình độ đầu vào</h2>
                <p>30 câu gồm điền từ, đọc hiểu và từ vựng – ngữ pháp để đánh giá trình độ toàn diện hơn.</p>

                {placementQuestions.length === 30 && placementQuestion ? (
                  <>
                    <div className="quiz-meta">
                      <span>Câu {placementIndex + 1}/30</span>
                      <span><Award size={15} /> Điểm: {placementScore}</span>
                    </div>
                    <div className="quiz-progress">
                      <span style={{ width: `${((placementIndex + (placementAnswered ? 1 : 0)) / 30) * 100}%` }} />
                    </div>
                    <div className="placement-section-label">
                      {placementQuestion.section || "VOCABULARY"}
                    </div>
                    <h2 className="quiz-question">{placementQuestion.question}</h2>

                    {placementQuestion.type === "reading" && (
                      <div className="placement-passage">
                        <strong>{placementQuestion.passageLabel}</strong>
                        <p>{placementQuestion.passage}</p>
                      </div>
                    )}

                    {(placementQuestion.type === "fill" || placementQuestion.type === "choice") && (
                      <p className="quiz-question" style={{ fontSize: 19, marginTop: 0 }}>
                        {placementQuestion.prompt}
                      </p>
                    )}

                    {(placementQuestion.type === "fill" || placementQuestion.type === "reading" || placementQuestion.type === "choice") && (
                      <div className="quiz-options">
                        {placementQuestion.options.map((option, i) => (
                          <button
                            key={`${placementIndex}-${i}`}
                            disabled={placementAnswered}
                            onClick={() => answerPlacementQuestion(i)}
                            className={`quiz-option ${
                              placementAnswered && i === placementQuestion.answer ? "is-correct" : ""
                            } ${
                              placementAnswered && i === placementSelected && i !== placementQuestion.answer ? "is-wrong" : ""
                            }`}
                          >
                            <span>{String.fromCharCode(65 + i)}</span>
                            {option}
                          </button>
                        ))}
                      </div>
                    )}

                    {placementAnswered && (
                      <div className="quiz-explanation">
                        <strong>
                          {placementSelected === placementQuestion.answer
                            ? "Chính xác!"
                            : "Chưa chính xác!"}
                        </strong>
                        {placementSelected !== placementQuestion.answer && (
                          <p>Đáp án đúng: <strong>{placementQuestion.options[placementQuestion.answer] || placementQuestion.answerText}</strong></p>
                        )}
                        {placementQuestion.sentenceTranslation && (
                          <p><strong>Dịch nghĩa câu:</strong> {placementQuestion.sentenceTranslation}</p>
                        )}
                        {placementQuestion.passageTranslation && (
                          <p><strong>Dịch nghĩa đoạn đọc:</strong> {placementQuestion.passageTranslation}</p>
                        )}
                        <p><strong>Vì sao chọn đáp án này:</strong> {placementQuestion.explanation}</p>
                        <div className="placement-option-review">
                          <strong>Giải nghĩa và phân tích 4 phương án</strong>
                          {placementQuestion.options.map((option, optionIndex) => (
                            <div className="placement-option-review-row" key={`review-${placementIndex}-${optionIndex}`}>
                              <div>
                                <b>{String.fromCharCode(65 + optionIndex)}. {option}</b>
                                <span>{getPlacementOptionMeaning(option, placementQuestion)}</span>
                              </div>
                              <small>{getPlacementOptionReason(placementQuestion, option, optionIndex)}</small>
                              {optionIndex === placementQuestion.answer && <em>✓ Đáp án đúng</em>}
                            </div>
                          ))}
                        </div>
                        <button className="primary-button quiz-next" onClick={nextPlacementQuestion}>
                          {placementIndex === 29 ? "Xem kết quả" : "Câu tiếp theo"}
                          <ArrowRight size={17} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p>Ngân hàng câu hỏi chưa tải đủ 30 câu. Hãy kiểm tra dữ liệu trước khi làm bài.</p>
                )}
              </div>
            ) : (
              <div className="quiz-result">
                <div className="result-mascot">🎓</div>
                <h2>Hoàn thành kiểm tra đầu vào!</h2>
                <p>Kết quả của bạn: <strong>{placementScore}/30 câu đúng</strong></p>
                <div className="result-score">{placementLevel}</div>
                <strong>Trình độ ChatPaw đề xuất</strong>
                <p>Bạn có thể xác nhận cấp độ này hoặc quay lại chọn thủ công.</p>
                <button className="primary-button" onClick={confirmPlacementLevel}>
                  Dùng trình độ {placementLevel}
                  <ArrowRight size={17} />
                </button>
                <button className="outline-button" style={{ marginLeft: 10 }} onClick={resetPlacement}>
                  <RotateCcw size={16} /> Làm lại bài kiểm tra
                </button>
              </div>
            )}
          </section>

        ) : !level ? (

          /* CHỌN TRÌNH ĐỘ */

          <section className="panel level-panel">

            <button
              className="text-button"
              onClick={() => chooseLanguage(null)}
            >
              <ArrowLeft size={16} /> Đổi ngôn ngữ
            </button>

            <div className="eyebrow">
              <GraduationCap size={16} />
              CHOOSE YOUR LEVEL
            </div>

            <h2>Chọn trình độ hiện tại</h2>

            <p>
              ChatPaw sẽ điều chỉnh độ khó theo cấp độ của bạn.
            </p>

            <div className="level-options">

              {levels[language].map((item, i) => (
                <button
                  key={item}
                  className={`level-card level-${i}`}
                  onClick={() => setLevel(item)}
                >
                  <span className="level-icon">
                    {["🌱", "⭐", "📈", "🏆"][i]}
                  </span>

                  <strong>{item}</strong>

                  <small>
                    {language === "en"
                      ? [
                          "Beginner",
                          "Elementary",
                          "Intermediate",
                          "Upper-Intermediate"
                        ][i]
                      : [
                          "Sơ cấp 1",
                          "Sơ cấp 2",
                          "Sơ cấp 3"
                        ][i]}
                  </small>
                </button>
              ))}

            </div>

            <div className="placement-cta">
              <div>
                <strong>Chưa biết mình ở trình độ nào?</strong>
                <p>Làm bài kiểm tra 30 câu để ChatPaw đề xuất cấp độ phù hợp.</p>
              </div>
              <button
                className="primary-button"
                onClick={() => {
                  resetPlacement();
                  setPlacementMode(true);
                }}
              >
                <GraduationCap size={17} />
                Kiểm tra trình độ · 30 câu
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="selection-status">
              <Sparkles size={17} />
              Có thể đổi trình độ bất cứ lúc nào.
            </div>

          </section>

        ) : !topic ? (

          /* CHỌN CHỦ ĐỀ */

          <section className="panel topics-panel">

            <button
              className="text-button"
              onClick={() => setLevel(null)}
            >
              <ArrowLeft size={16} /> Đổi trình độ
            </button>

            <div className="eyebrow">
              <BookOpen size={16} />
              PRACTICE TOPICS
            </div>

            <h2>Chọn chủ đề học tập</h2>

            <p>
              Mỗi chủ đề có chatbot, 30 câu bài tập và audio riêng.
            </p>

            <div className="topic-grid">

              {topics[language].map(item => (
                <button
                  key={item.name}
                  className="topic-card"
                  onClick={() => chooseTopic(item)}
                >
                  <span className="topic-emoji">{item.icon}</span>
                  <strong>{item.name}</strong>
                  <small>{item.desc}</small>
                </button>
              ))}

            </div>

          </section>

        ) : (

          /* KHÔNG GIAN HỌC TẬP */

          <section className="learning-workspace">

            <button
              className="text-button"
              onClick={goBackToTopics}
            >
              <ArrowLeft size={16} /> Tất cả chủ đề
            </button>

            <div className="workspace-banner">

              <span className="workspace-emoji">
                {topic.icon}
              </span>

              <div>
                <div className="eyebrow">
                  YOUR CURRENT LESSON · {level}
                </div>

                <h1>{topic.name}</h1>

                <p>
                  {language === "en"
                    ? "English learning"
                    : "中文学习"} · {level}
                </p>
              </div>

            </div>

            {!mode ? (

              /* BA HOẠT ĐỘNG */

              <>

                <div className="section-heading">
                  <h2>Hôm nay bạn muốn học gì?</h2>
                  <p>Chọn một trong ba hoạt động dưới đây.</p>
                </div>

                <div className="activity-cards">

                  <button
                    className="activity-card"
                    onClick={startChat}
                  >
                    <span className="activity-icon chat-icon">
                      <MessageCircle />
                    </span>

                    <strong>Chatbot hội thoại</strong>

                    <p>
                      Trò chuyện với Gemini AI, hỏi đáp tự nhiên
                      và sửa lỗi ngôn ngữ.
                    </p>

                    <span className="activity-link">
                      Bắt đầu trò chuyện
                      <ArrowRight size={16} />
                    </span>
                  </button>

                  <button
                    className="activity-card"
                    onClick={() => {
                      resetQuiz();
                      setMode("quiz");
                    }}
                  >
                    <span className="activity-icon quiz-icon">
                      <GraduationCap />
                    </span>

                    <strong>Làm bài tập</strong>

                    <p>
                      30 câu hỏi riêng cho chủ đề này,
                      chấm điểm và giải thích đáp án.
                    </p>

                    <span className="activity-link">
                      Bắt đầu luyện tập
                      <ArrowRight size={16} />
                    </span>
                  </button>

                  <button
                    className="activity-card"
                    onClick={() => {
                      window.speechSynthesis?.cancel();
                      setAudioIndex(0);
                      setAudioStarted(false);
                      setMode("audio");
                    }}
                  >
                    <span className="activity-icon audio-icon">
                      <Headphones />
                    </span>

                    <strong>Audio phát âm</strong>

                    <p>
                      Nghe câu mẫu và luyện nói theo
                      giọng đọc của trình duyệt.
                    </p>

                    <span className="activity-link">
                      Nghe mẫu câu
                      <ArrowRight size={16} />
                    </span>
                  </button>

                </div>

              </>

            ) : (

              /* KHU VỰC HOẠT ĐỘNG */

              <section className="panel activity-panel">

                <div className="activity-toolbar">

                  <button
                    className="text-button"
                    onClick={() => {
                      window.speechSynthesis?.cancel();
                      setMode(null);
                      setError("");
                    }}
                  >
                    <ArrowLeft size={16} /> Ba lựa chọn
                  </button>

                  <span className="eyebrow">
                    {mode === "chat"
                      ? "AI CONVERSATION"
                      : mode === "quiz"
                      ? "PRACTICE"
                      : "PRONUNCIATION"}
                  </span>

                </div>

                {/* CHATBOT */}

                {mode === "chat" && (

                  <div className="chat-box">

                    <div className="chat-header">

                      <div className="chat-avatar">
                        <PawPrint />
                      </div>

                      <div>
                        <strong>ChatPaw AI</strong>
                        <small>
                          <span className="online-dot" />
                          Trợ giảng AI · {level}
                        </small>
                      </div>

                      <div className="chat-time">
                        <Clock3 size={14} />
                        {time || "Đang lấy giờ..."}
                      </div>

                    </div>

                    <div className="chat-messages">

                      {messages.map((message, i) => (
                        <div
                          className={`chat-message ${message.role}`}
                          key={i}
                        >

                          {message.role === "assistant" && (
                            <span className="chat-message-avatar">
                              🐶
                            </span>
                          )}

                          <div className="chat-bubble">

                            <p>{message.text}</p>

                            {message.role === "assistant" && (
                              <button
                                className="listen-inline"
                                onClick={() => speak(message.text)}
                              >
                                <Volume2 size={14} />
                                Nghe
                              </button>
                            )}

                          </div>

                        </div>
                      ))}

                      {loading && (
                        <div className="chat-message assistant">
                          <span className="chat-message-avatar">🐶</span>

                          <div className="chat-bubble">
                            <LoaderCircle className="spin" />
                            ChatPaw đang suy nghĩ...
                          </div>
                        </div>
                      )}

                      <div ref={chatEnd} />

                    </div>

                    {error && (
                      <div className="inline-error">
                        <CircleHelp size={15} /> {error}
                      </div>
                    )}

                    <form
                      className="chat-composer"
                      onSubmit={sendMessage}
                    >

                      <input
                        ref={chatInput}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={
                          language === "zh"
                            ? "输入中文或提问..."
                            : "Nhập câu hỏi bằng tiếng Anh..."
                        }
                        disabled={loading}
                      />

                      <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        aria-label="Gửi"
                      >
                        {loading
                          ? <LoaderCircle className="spin" size={18} />
                          : <Send size={18} />}
                      </button>

                    </form>

                    <p className="chat-footnote">
                      ChatPaw có thể trả lời câu hỏi ngoài chủ đề.
                      Câu hỏi về thời gian sử dụng đồng hồ Việt Nam.
                    </p>

                  </div>
                )}

                {/* BÀI TẬP */}

                {mode === "quiz" && (

                  <div className="quiz-area">

                    {questions.length !== 30 ? (

                      <div className="quiz-result">
                        <h2>Dữ liệu bài tập chưa hợp lệ</h2>
                        <p>
                          Số câu hiện tại: {questions.length}.
                          Cần kiểm tra ngân hàng câu hỏi.
                        </p>
                      </div>

                    ) : !finished ? (

                      <>

                        <div className="quiz-meta">
                          <span>
                            Câu {questionIndex + 1}/{questions.length}
                          </span>

                          <span>
                            <Award size={15} />
                            Điểm: {score}
                          </span>
                        </div>

                        <div className="quiz-progress">
                          <span
                            style={{
                              width: `${
                                ((questionIndex + (answered ? 1 : 0)) /
                                  questions.length) * 100
                              }%`
                            }}
                          />
                        </div>

                        <div className="eyebrow">
                          {language === "en"
                            ? "ENGLISH PRACTICE"
                            : "中文练习"}
                        </div>

                        <h2 className="quiz-question">
                          {currentQuestion.question}
                        </h2>

                        {currentQuestion.type === "fill" && currentQuestion.prompt && (
                          <div className="quiz-reading-passage quiz-fill-prompt">
                            <p>{currentQuestion.prompt}</p>
                            {currentQuestion.sentenceTranslation && (
                              <p className="quiz-passage-translation">
                                <b>Dịch nghĩa:</b> {currentQuestion.sentenceTranslation}
                              </p>
                            )}
                          </div>
                        )}

                        {currentQuestion.type === "reading" && currentQuestion.passage && (
                          <div className="quiz-reading-passage">
                            {currentQuestion.passageLabel && <strong>{currentQuestion.passageLabel}</strong>}
                            <p>{currentQuestion.passage}</p>
                            {currentQuestion.passageTranslation && (
                              <p className="quiz-passage-translation">
                                <b>Bản dịch:</b> {currentQuestion.passageTranslation}
                              </p>
                            )}
                          </div>
                        )}

                        {currentQuestion.type === "choice" && currentQuestion.prompt && (
                          <p className="quiz-question-prompt">{currentQuestion.prompt}</p>
                        )}

                        <div className="quiz-options">

                          {currentQuestion.options.map((option, i) => (
                            <button
                              key={i}
                              disabled={answered}
                              onClick={() => answerQuestion(i)}
                              className={`quiz-option ${
                                answered && i === currentQuestion.answer
                                  ? "is-correct"
                                  : ""
                              } ${
                                answered &&
                                i === selected &&
                                i !== currentQuestion.answer
                                  ? "is-wrong"
                                  : ""
                              }`}
                            >

                              <span>
                                {String.fromCharCode(65 + i)}
                              </span>

                              {option}

                              {answered &&
                                i === currentQuestion.answer && (
                                  <CheckCircle2 size={18} />
                                )}

                            </button>
                          ))}

                        </div>

                        {answered && (

                          <div className="quiz-explanation">

                            <strong>
                              {selected === currentQuestion.answer
                                ? "Chính xác! 🎉"
                                : "Cố gắng nhé! 🌱"}
                            </strong>

                            <p>
                              <b>Đáp án đúng:</b>{" "}
                              {currentQuestion.options[currentQuestion.answer]}
                            </p>

                            <p>
                              <b>Giải thích:</b>{" "}
                              {currentQuestion.explanation}
                            </p>

                            {currentQuestion.sentenceTranslation && currentQuestion.type !== "fill" && (
                              <p><b>Dịch nghĩa:</b> {currentQuestion.sentenceTranslation}</p>
                            )}

                            <p className="grammar-note">
                              <b>Kiến thức cần nhớ:</b>{" "}
                              {getDetailedGrammarNote(
                                currentQuestion.question,
                                language
                              )}
                            </p>

                            <div className="option-meanings">

                              <strong>
                                Nghĩa tiếng Việt của từng lựa chọn:
                              </strong>

                              {currentQuestion.options.map((option, i) => (
                                <div
                                  className="option-meaning-row"
                                  key={i}
                                >

                                  <b>
                                    {String.fromCharCode(65 + i)}. {option}
                                  </b>

                                  <span>
                                    Nghĩa: {currentQuestion.meanings?.[i] || currentQuestion.optionMeanings?.[option] || "Xem giải thích bên dưới"}
                                  </span>

                                  {currentQuestion.optionReasons?.[option] && (
                                    <span className="option-reason">
                                      {currentQuestion.optionReasons[option]}
                                    </span>
                                  )}

                                  {i === currentQuestion.answer && (
                                    <em>✓ Đáp án đúng</em>
                                  )}

                                </div>
                              ))}

                            </div>

                          </div>
                        )}

                        {answered && (

                          <button
                            className="primary-button quiz-next"
                            onClick={nextQuestion}
                          >
                            {questionIndex + 1 === questions.length
                              ? "Xem kết quả"
                              : "Câu tiếp theo"}

                            <ArrowRight size={17} />
                          </button>

                        )}

                      </>

                    ) : (

                      /* KẾT QUẢ */

                      <div className="quiz-result">

                        <div className="result-mascot">
                          {score >= 15 ? "🏆" : "🐾"}
                        </div>

                        <h2>Hoàn thành bài tập!</h2>

                        <p>
                          Bạn đã hoàn thành 30 câu chủ đề {topic.name}.
                        </p>

                        <div className="result-score">
                          {score}/30
                        </div>

                        <strong>
                          {Math.round((score / 30) * 100)}% chính xác
                        </strong>

                        <button
                          className="primary-button"
                          onClick={resetQuiz}
                        >
                          <RotateCcw size={17} />
                          Làm lại bài
                        </button>

                      </div>

                    )}

                  </div>
                )}

                {/* AUDIO - TIN NHẮN HỘI THOẠI HAI NHÂN VẬT */}

                {mode === "audio" && (

                  <div className="audio-area">

                    <div className="audio-intro">
                      <span className="activity-icon audio-icon">
                        <Volume2 />
                      </span>
                      <h2>{audioStory?.title || "Luyện nghe hội thoại"}</h2>
                      <p>
                        {audioStory?.emoji} Hai nhân vật thay phiên trò chuyện.
                        Mỗi tin nhắn có bản dịch tiếng Việt bên dưới.
                      </p>
                    </div>

                    <label className="speech-rate">
                      Tốc độ đọc
                      <select value={rate} onChange={e => setRate(e.target.value)}>
                        <option value="0.7">Chậm</option>
                        <option value="0.85">Bình thường</option>
                        <option value="1">Tự nhiên</option>
                      </select>
                    </label>

                    {audioStory?.dialogues?.length > 0 ? (
                      <div className="story-dialogue audio-messenger">

                        <div className="story-progress">
                          <span>
                            {audioStarted
                              ? `ĐÃ HIỆN ${audioIndex + 1} / ${audioStory.dialogues.length} TIN NHẮN`
                              : `${audioStory.dialogues.length} LƯỢT THOẠI`}
                          </span>
                          <div>
                            <i
                              style={{
                                width: audioStarted
                                  ? `${((audioIndex + 1) / audioStory.dialogues.length) * 100}%`
                                  : "0%"
                              }}
                            />
                          </div>
                        </div>

                        <div className="audio-chat-window" ref={audioChatWindow}>
                          {!audioStarted ? (
                            <div className="audio-welcome">
                              <div className="audio-welcome-avatars">
                                <span>🐶</span>
                                <span>🐱</span>
                              </div>
                              <strong>Một cuộc trò chuyện sắp bắt đầu!</strong>
                              <p>
                                Nhấn Bắt đầu để hiện tin nhắn đầu tiên
                                và nghe hai nhân vật trò chuyện nhé.
                              </p>
                            </div>
                          ) : (
                            audioStory.dialogues
                              .slice(0, audioIndex + 1)
                              .map((dialogue, index) => {
                                const isSecond = index % 2 === 1;
                                return (
                                  <div
                                    className={`audio-chat-message ${isSecond ? "character-two" : "character-one"}`}
                                    key={`${index}-${dialogue.speaker}`}
                                  >
                                    <div className="audio-character-avatar">
                                      {isSecond ? "🐱" : "🐶"}
                                    </div>

                                    <div className="audio-message-content">
                                      <strong className="audio-speaker">
                                        {dialogue.speaker || (isSecond ? "Mia" : "Leo")}
                                      </strong>

                                      <div className="audio-message-bubble">
                                        <small>
                                          {language === "zh" ? "CHINESE" : "ENGLISH"}
                                        </small>
                                        <p>{getDialogueText(dialogue)}</p>
                                        {language === "zh" && getDialoguePinyin(dialogue) && (
                                          <p className="audio-pinyin">
                                            Pinyin: {getDialoguePinyin(dialogue)}
                                          </p>
                                        )}
                                        <button
                                          type="button"
                                          className="listen-inline"
                                          onClick={() => speak(getDialogueText(dialogue))}
                                        >
                                          <Volume2 size={15} />
                                          Nghe lại
                                        </button>
                                      </div>

                                      <div className="audio-message-meaning">
                                        <small>NGHĨA TIẾNG VIỆT</small>
                                        <p>{dialogue.meaning || "Chưa có bản dịch cho câu này."}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                          )}
                        </div>

                        {audioStarted && currentDialogue && (
                          <div className="audio-practice">
                            <strong>🎙️ Đến lượt cậu luyện nói</strong>
                            <p>Đọc lại câu mẫu để mở khóa tin nhắn tiếp theo.</p>
                            <div className="audio-practice-actions">
                              <button type="button" className="outline-button" onClick={() => speak(currentDialogueText)}><Volume2 size={15} /> Nghe mẫu</button>
                              {!recording ? (
                                <button type="button" className="primary-button" disabled={audioBusy || speechPassed} onClick={startRecording}><Headphones size={15} /> {audioBusy ? "Đang mở micro..." : "Ghi âm câu trả lời"}</button>
                              ) : (
                                <button type="button" className="primary-button" onClick={stopRecording}>Dừng ghi âm</button>
                              )}
                              {recordingUrl && <button type="button" className="outline-button" onClick={() => new Audio(recordingUrl).play().catch(() => setSpeechFeedback("Không phát được bản ghi."))}><Volume2 size={15} /> Nghe bản ghi</button>}
                            </div>
                            {recognizedSpeech && <p className="recognized-speech"><b>Máy nhận diện:</b> {recognizedSpeech}</p>}
                            {speechFeedback && <p className={speechPassed ? "speech-feedback success" : "speech-feedback"}>{speechFeedback}</p>}
                            <small className="audio-disclaimer">Nhận diện giọng nói chỉ đối chiếu nội dung, không thể chấm chính xác toàn bộ phát âm.</small>
                          </div>
                        )}

                        <div className="story-controls audio-controls">
                          <button
                            type="button"
                            className="outline-button"
                            disabled={!audioStarted || audioIndex === 0}
                            onClick={previousAudio}
                          >
                            <ArrowLeft size={15} />
                            Trước
                          </button>

                          {!audioStarted ? (
                            <button
                              type="button"
                              className="primary-button"
                              onClick={startAudio}
                            >
                              <Volume2 size={16} />
                              Bắt đầu
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="primary-button"
                              onClick={nextAudio}
                              disabled={!speechPassed}
                            >
                              {audioIndex === audioStory.dialogues.length - 1
                                ? "Kết thúc"
                                : "Tiếp theo"}
                              <ArrowRight size={16} />
                            </button>
                          )}
                        </div>

                        {audioStarted && audioIndex === audioStory.dialogues.length - 1 && (
                          <p className="audio-complete">
                            🎉 Cậu đã nghe hết cuộc trò chuyện! Nhấn Kết thúc
                            để bắt đầu lại từ đầu.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="quiz-result">
                        <h2>Chưa có audio cho chủ đề này</h2>
                        <p>Kiểm tra dữ liệu trong audioStories.js nhé.</p>
                      </div>
                    )}

                    <p className="audio-note">
                      Tin nhắn mới chỉ xuất hiện khi cậu nhấn Tiếp theo.
                      Giọng đọc sử dụng Web Speech API của trình duyệt.
                    </p>
                  </div>
                )}
              </section>

            )}

          </section>

        )}

      </main>

      {/* FOOTER */}

      <footer id="about">

        <div className="footer-brand">
          <PawPrint size={20} />
          ChatPaw 2.0
        </div>

        <p>
          Học ngoại ngữ cùng AI, khám phá thế giới mỗi ngày. 🌿
        </p>

        <span>
          English A1–B2 · 中文 HSK 1–3
        </span>

        <p>
          360 câu hỏi · 12 chủ đề · 2 ngôn ngữ
        </p>

      </footer>

    </div>
  );
}