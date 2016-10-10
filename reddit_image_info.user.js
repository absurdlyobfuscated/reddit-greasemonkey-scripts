// ==UserScript==
// @name        reddit image info
// @namespace   reddit
// @description Reddit image info
// @include     https://*.reddit.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @version     1.1.3.2
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// ==/UserScript==

// An imgur api client ID can be acquired by registering an imgur app here: https://api.imgur.com/oauth2/addclient
var clientId = "2eb3b0a17b566b2";

// Highlight and color options
var highlightAnimated = true;
var imgurAlbumColor = "yellow";
var imgurGalleryColor = "yellow"; // Includes gallery and image page (imgur.com/gallery/id and imgur.com/id)
var imgurGifvColor = "blue";
var imgurWebmColor = "teal";
var imgurGifColor = "orange";
var gifColor = "orange";
var gfyColor = "purple";

var colorLongDuration = true;
var longDurationMin = 15; // Time in seconds
var longDurationMax = 20;

var colorLargeSize = true;
var largeSize = 10000000;
var largeSizeColor = "red";

var highlightSameTitle = true;
var sameTitleColor = "yellow";
var highlightSameAuthor = true;
var sameAuthorColor = "green";
var highlightGalleryReposts = true;
var galleryRepostColor = "orange";

var highlightImgurCommentReposts = true;
var checkTopLevelCommentsOnly = false;

// Imgur author warnings: [["author", "warning description", "backgroundcolor", "textcolor"], ...]
var authorWarnings = [
  [/^(Jumzler|popularnow|LenisModels1|FunnyLand|BrevleyDiamond|viralspell|apkapps|AnimalsCrazy|seoenroll|hansreal999|doublehot|mouyanali55|sohail3669998|lovesashagrey|droidkaran|advinclark|apexablog|Freechannelgame|NishaSen|HiraKhan00753|BestFail|anondexter786|andrew1122|thehrtailoo|nataliaaftermath|Katherinerpinkham|omgrides|oliverisback|rakeshhocrox|shez12|usmanmehmood2014|Dostosalam|catsneko|funstop|ijazjaan12|Revanoz|JennyMarry|waqasarshad|patrickweberz|Theni|anees123|Sarajaan|sainib626|cthoughtz|THaruGunawardhana|Quotesomnia|UsmanMani|Statelessss|hasnian007|hasnain007|viralcontent|thefunnynews|UshaPriya|rishitha1986|wukangye|smith64|asadblogger|99Tunes|sunnykhan2163|pearlriver|livestreambull11|active999|dulocemu|1i2i3i4i|MuhammadZeeshanAshraf|shiblu001|goodfotos|fotostoday|iloveyouallhere|BigoGallery|Redditaccounts|odosta|ssrgupta|funngeeks|Virgo200|dailynewspaperpk|bellarocks1|inspiringfeed|SajidAliturri|MikeConnell|adam460|cr70100|janhanzab|geebrodo|fianacra|saba456|saluzia|meghissmeghiss|mikejohnsonsq|MyDogLikes|katrinasweety|heyshanug|AllTechAbout|walllo|celebritiesmania|mylocurtisgold|iwebAmazingThings|meelak007|Fashiontactics|WakasKhalid|Viralnewzz|snwz|wakaskhalid1989|mrandmrsjhoni|Zuqarnain|lorrainemcguire|9hues|IKNIAZI|JessicaCraz|Michelew|RajaArsalan|MuhmmadMughal|Diamondkickk|eyyina|VerlyMarket|thelolagemannu|prasad999|anon071|randomgibberishs|Jujubeanie646|coronalmassejections|PotatoesPotates|OsamaAhmad|bestclones|ansarig|wirlog|boyaji2426|Bilalahmed12|qasimali001|pinki22|moviesmag|MarquisDeSadeVIIl|Bilalahmed1996|khokonapon|naeemkkk|OksanaShevchenko|qureshi778|Imtiazkrk|WOWSOMEAPP|itsmegloria|ViralPlaces|porakopal5|noormohd405|albakistan|newmovies2k|emily008|ShareWorldOnline|yasirilyas33|adamminhas12|EspnLive|RisteJordanoski|RustamSatti|WaheedChohan|funworldimaginator|micalalex|reallove23|usman634|trendingnow|upers302|wallpaperhdpk|waseem42|syedasadsheeraz|phunkyp77|hammad4466|TheHappyHumans23456|AhmedSheno|DavidBrents|oaques|justin8b6cvw|socialispiice|ThugLifeMemes|azhar190|amerxp00|dhealthfitness|NabeelAlvi|Phenomenic|uslivestream|usmanali173|fashionfusion|nomantufail|juduma|jonnybagofdonuts|ladynik|mornabo|viraltodays|lovenest|jobhawks|shitMH|usm05|Mrimgurianz|Shezadadil|ShivKumar2312|com9000|Apnehd|70mmarena|SoniaKapoor007|Tehminasani|sachinyadav1|nevershutupnet|oicu|sandinglondoncoUK|piaskabir|iamtocute|RSamual|freeustad|bradpifffff|creedenz|lemonfridge|thursdaynightfootballlivejetsvspatriots|muneeb3372|tchapiiila|pontifex\d+|sidhu340|jawwadhussain|Apnehd|coolboyy1991|bloggingtrendz|Rakesh216|Newsbbc|smileyrose|GiftsFromMars|MuhammedUmar|gongobonk|nazranagul|gretai|rypa|DoctorsAdvice|ShorabShanto09|sheikhsherry|beautysomething|Recipesbar|anayat031|Robbasaurusrex|rachaelblake007|artcollections25|qptopm|YoussefHamdi|jams13242|jenniferstuart|AtaRehman|wittenvdp|alinaafoster|unikilarki|MohiniKumari|kzeerox|MichelleKeeganUK|relaxedpath|KkossAsa|ShyamOruganti|theUmarFarooq|tskdevelopers|alexryan360|DonaldTrumpPresident|CrazyThing|august04|Udaya12|sweettania|mariakhan384mz|zohaib615|ShahzaibAnwar|YousafBhutta|zola18|ACchannel|somewin|ACchannel|SoniaRizvi|Xainkungjee|chadin12|hajar74|DailyzFun|bhupifxartist|seoanubhavgarg|dailypakistani|andyben|powerforever|ritanmnews|bigggggy|SelfishJerry|sayhi0092|top10newvideo|tronghai175|mshoaib|artikelnummer|ParmjitSingh|WladimirKlitschkovsAlexLeapailivestreaming|SportsBait|RosalieOdell|chiaalain|samsmith2|ustype|rahulraj1989|mooolander|amy8861|farimalik822|SafeerWarraich|sfr99|niceseoguy|osarenomaofficial|matronson|stellavictoria|tufailahmad|Viralpediaorg|babyu59|fzy326|smoke4me|sadiakomal|TheodoreScott|ppushmeupp|FahadFahad0312)$/, "spam", "red"],
  [/WeirdFunny|XaleemIqbal|IndigoAditya|Goodboye|bellaluna|FS22|hila(rious)?gifs|AsadRehman|UmairTariq|umairkhan|umarnisar65|Taimoor03|GayishFields|silverscreen1|mansoor1223|buntybubbly|FamilyIsEverythings|OliverClothesoff70|zeevipcom/, "possible spam?", "yellow", "black"],
  [/KAMRAN20896|AwaisRao|RizwanMukarram|chusman222|AenaThought|theasharali|cuteviki|ShafiqMughal|lolxpk|nomanramzan91|Abhinayaa|gigiiiiiiiii|redditloverss|2cutemade|Polareddit|Funkylimp|siddasad|mohsinsidd|niceskill|john262|tonny48|ennadavid|alihere21|redrose465|SMLolzz|Binditori|UsmanIshaque|seenu123|raj4770|basha4Seo|ArslanHaider|ManzoorHussain|RockingRafiq|waqar|irfii|khawarhussain|AqEel79|EMTheads|AliShaikh1|nazima111|Saifuu|VivekBhardwaj|TheNightmarexD|WWEFightTime|emlyrose|ayyazkhan111|zeeshi005|WaqarVicky|Rossy777|MUhammadkashifHussain|saleena66|nadiagull|mazzsam|samsjeee|usamamaqbool|saharnewspk|nezamnur|nezamuddin|alltimehit|jenniferange326|smmostafiz|skaka090|dyes82826908|jhoncrray|Happynow778|sokalratre|catfunny|asharh60|UsmanJohn|Princes660|galive|AhsanAwan44|KhanFarooq1122|rottweiler90|masttoqeer|AliArshad367|shehrazali0344|FarhanAhmed|farukomar|JoyceRuiz|johnpetter00|getfunda|HammadKhalid1|sahilkhan6550|exceltera|malikazam03|maxe60700|uzikmi|sabbirkhan49|buchibaba|asad660|umar7320|mubi92|syedbahi|MuhammedUmar|waheedalam|clicktoseo|absayed00|Emaanali786|zain92|akakakak230|awww7|FaisalSharif|humaaahumaghumagh|s1234560|ShafqatKhan|ateeq2014|kashifmughal|shahzad755|Teebus|redditcool12|mmfaizan1|usmanobf|shah30202|Vieur|nancy101mama|iammht|hottufail|procasteenation|Haymi197|suvabrata4u|shitfacts|johny909|waviral|ChrisMorningStar|nurunnaharamily2|gkane839|deshku|gpmodem|irscia|paala1|CallieMarta|Nonyjan|AdeelSaqlain363|adiltahir353|RajkumarSoni|junaidsafdar93|engzain63|sbshoukat|sadaqatali581|mani5|gmmostofa|skywalkerlover|sajjadsgd|X4ce|salman033|saniaakram|khiladi007|YasirMehmood4200|arsalan5678|IndianTechHunter|Basitwahid|amyjasmin|aliashber|asadqamar|Hassanyousafi|ENTERTAINMENTFUN|AngelinaMKS|muhamadqasim76|AlimTasnim|mulla1111|karyn143|djrizzz88|rizztaxtic|raoo248|mubeenazam007|heraani|entertainmentmania|qasimranjha420|nasirkhan552|FahadMeo|MudassarAli5879|bhokersinghindiawale|coolusama|CourtneyJValencia|rodger1122|avneesh61|ramansidhu|abrehman786|MohitLatami|faisalmotan|bezroofmax|Princesnoor|recumbetntbike|funmaza004|rehmancoaching|juliarobart|viralthis|kohinoorprince|RODGERALLEN|worldsaeedkhan|sfsaifi|shafqatazeem|AishaClicker|ZainRiaz|BreakfastRecipes3786|jonh2016|extremegrowth|aliafzalbaloch|shehbazkhattaq|a00796|AzanAli75|At0ZWORlD|AnastasiyaLibra|WaqarQurashiQaisrani|Abdullahkhanimugr|nextdoorto|DanishAliKhan|shehbazkhan|malikwaheed1|NaeemNimi|babarmaqbool|nk934934|Afghannews|kashif88166|yasirali66|proscience|TopFootBallgoals|AsadIqbal786|HamzaShahid0313|imran11|marilouadeel|mallhi009|clicker0099|MaiHonHasan|KinGui|ArslanMunir987|dewanaho|rahul91star|TravelonBudget|ChristinaCPowers|dasjoydeb8|MuzammilHr/, "account farmer content source", "red"],
  [/^[A-Z]{11}$/, "random 11 char name, probable repost bot content source", "orange"],
  [/undercovergiraffe|SAFE4WORK|Datsun280zxt|LindaDee|thund3rbolt/, "frequent long GIFs", "orange"],
  [/lnfinity00/, "vegan spam", "orange"],
];
// Image warnings: [[width, height, size, "description", "backgroundcolor", "textcolor"], ...]
var imgWarnings = [
  [245, 201, 2083765, "shoveldog", "red"],
  [242, 201, 2058523, "shoveldog", "red"],
  [245, 201, 1891453, "shoveldog", "red"],
  [1233, 1203, 173520, "zippocat", "red"],
  [1233, 1203, 222708, "zippocat", "red"],
  [590, 978, 172310, "hanged cat", "red"],
  [225, 300, 44713, "hanged dog", "red"],
  [200, 150, 963149, "firekitty", "red"],
  [308, 231, 2048826, "child nudity", "red"],
];

// Set to true to clear all saved info, otherwise all cached items older than maxCacheAge will be cleared automatically
var clearCache = false;
var maxCacheAge = 1 * 60 * 60 * 1000; // Time in ms

//////////////////////////////////////////////////////////////////////////////


////  $.ajax({url: "https://api.imgur.com/3/gallery/pes1Iyp", headers: {"Authorization": "Client-ID 8a1945579157393"}, success: function(data, textStatus, request) { var data = JSON.parse(request.responseText).data; console.log(data); }, error: function(request, textStatus, error) { var data = JSON.parse(request.responseText).data; console.log(data); console.log(error); } });

if (clearCache)
{
  window.setTimeout(function()
  {
    var keys = GM_listValues();
    for (var i = 0; i < keys.length; i++)
      GM_deleteValue(keys[i]);
  }, 5000);
}
else
{
  window.setTimeout(function()
  {
    var count = 0;
    var time = Date.now();
    var keys = GM_listValues();
    for (var i = 0; i < keys.length; i++)
    {
      var savedValue = JSON.parse(GM_getValue(keys[i], null));
      if (savedValue[0] < time - maxCacheAge)
      {
        GM_deleteValue(keys[i]);
        count++;
      }
    }
    console.log("reddit image info: " + (Date.now() - time) + "ms cleanup time, " + count + " removed, " + (keys.length - count) + " remaining");
  }, 30000);
}

// https://gist.github.com/dperini/729294#file-regex-weburl-js
var urlRegex = /(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?/i;

function linkify(str)
{
  if (str.indexOf("<a") > -1)
    return str; // Already linkified, imgur does this when it adds 'nofollow' to FB and other sites' links
  var match = str.match(urlRegex);
  if (match)
    return str.substring(0, str.indexOf(match[0]) + match[0].length).replace(match[0], "<a href=\"" + match[0] + "\">" + match[0] + "</a>") + linkify(str.substring(str.indexOf(match[0]) + match[0].length));
  else
    return str;
}

function zp2(str)
{
  return ("0" + str).slice(-2);
}

function linkColor(href)
{
  if (/\/a\/[\d\w]{5,6}([^\d\w]|$)/i.test(href))
    return imgurAlbumColor;
  if (/\.gifv$/i.test(href))
    return imgurGifvColor;
  if (/\.(webm|mp4)$/i.test(href))
    return imgurWebmColor;
  if (/\.\w+(\?.+)?$/i.test(href))
    return imgurGifColor;
  return imgurGalleryColor;
}

function highlightLink(link, color)
{
  if (color == null)
    color = "red";
  $(link).parents("div.link").find("a.thumbnail").first().attr("style", "border: 3px solid " + color + " !important");
}

function dateDiff(diff)
{
  return (diff < 0 ? "+" : "-") + (Math.abs(diff / 24 / 60 / 60 / 1000) >= 1 ? Math.floor(Math.abs(diff / 24 / 60 / 60 / 1000)) + "D " : "") + zp2(Math.floor(Math.abs(diff / 60 / 60 / 1000)) % 24) + ":" + zp2(Math.floor(Math.abs(diff / 60 / 1000)) % 60) + ":" + zp2(Math.floor(Math.abs(diff / 1000)) % 60);
}

function processImgurInfo(link, match, data)
{
  var id = match[2];
  var isGallery = data.score != null;
  var author = data.account_url || (isGallery ? "(auto)" : null);
  if (data.images)
  {
    var images = data.images;
    for (var i = 0; i < images.length; i++)
    {
      if (images[i].animated)
      {
        GM_setValue(id, JSON.stringify([Date.now(), true, isGallery, true, author, 0, 0, 0, data.datetime, data.title, data.description, data.topic ? data.topic : data.section, data.nsfw]));
        if (highlightAnimated)
          highlightLink(link, linkColor($(link).attr("href")));
        break;
      }
      if (i == images.length - 1)
        GM_setValue(id, JSON.stringify([Date.now(), false, isGallery, true, author, 0, 0, 0, data.datetime, data.title, data.description, data.topic ? data.topic : data.section, data.nsfw]));
    }
    showImgurInfo(link, match, false, isGallery, true, author, 0, 0, 0, data.datetime, data.title, data.description, data.topic ? data.topic : data.section, data.nsfw);
  }
  else
  {
    GM_setValue(id, JSON.stringify([Date.now(), data.animated, isGallery, false, author, data.width, data.height, data.size, data.datetime, data.title, data.description, data.topic ? data.topic : data.section, data.nsfw]));
    if (highlightAnimated && (data.animated || data.type == "image/gif")) // data.animated isn't 100% accurate, eg: http://i.imgur.com/prPWR.jpg
      highlightLink(link, linkColor($(link).attr("href")));
    showImgurInfo(link, match, data.animated, isGallery, false, author, data.width, data.height, data.size, data.datetime, data.title, data.description, data.topic ? data.topic : data.section, data.nsfw);
  }
}

function showImgurInfo(link, match, animated, isGallery, isAlbum, author, width, height, size, datetime, title, description, topic, nsfw)
{
  var id = match[2];
  var entry = $(link).parents(".entry");
  var href = $(link).attr("href");
  var timestamp = new Date(datetime * 1000);
  var diff = new Date(entry.find("time").attr("datetime")).getTime() - datetime * 1000;
  var warningReason = null;
  var warningBackColor, warningForeColor;
  for (var i = 0; i < imgWarnings.length; i++)
  {
    if (imgWarnings[i][0] == width && imgWarnings[i][1] == height && imgWarnings[i][2] == size)
    {
      warningReason = imgWarnings[i][3];
      warningBackColor = imgWarnings[i][4];
      warningForeColor = imgWarnings[i][5];
    }
  }
  for (i = 0; i < authorWarnings.length; i++)
  {
    if (authorWarnings[i][0].test(author))
    {
      warningReason = authorWarnings[i][1];
      warningBackColor = authorWarnings[i][2];
      warningForeColor = authorWarnings[i][3];
    }
  }
  var infoContent = "<span class=\"imageInfo\">";
  infoContent += (isGallery ? "gallery" + (/imgur\.com\/t(opic)?\//i.test(href) ? " (topic format)" : "") + ": <a href=\"https://imgur.com/gallery/" + id + "\">" + author + "</a>" : "<a href=\"https://imgur.com/" + id + "\">" + (author ? author : "imgur") + "</a>");
  if (warningReason != null)
    infoContent += "<span class=\"pretty-button\" style=\"background-color: " + warningBackColor + "; color: " + (warningForeColor == null ? "white" : warningForeColor) + ";\">" + warningReason + "</span>";
  if (highlightSameAuthor && author != null && author.toLowerCase() == entry.find("p.tagline a.author").text().toLowerCase().replace(/(\-|\_)/g, ""))
    infoContent += "<span class=\"pretty-button\" style=\"background-color: " + sameAuthorColor + "; color: white;\" title=\"reddit author matches imgur author\">=</span>";
  if (highlightGalleryReposts && author == "(auto)" && Math.abs(diff) > 1200000)
    infoContent += "<span class=\"pretty-button\" style=\"background-color: " + galleryRepostColor + "; color: white;\" title=\"possible reposted gallery post\">!</span>";
  if (title)
  {
    infoContent += " " + (nsfw ? "<span class=\"nsfw-stamp stamp\">NSFW</span> " : "") + (topic != null && topic != "" ? "[" + topic + "] " : "") + "\"" + title + (description == null ? "" : " --- " + linkify(description).replace(/\n/g, "<br>")) + "\"";
    if (highlightSameTitle)
    {
      var redditTitle = $(link).text().toLowerCase();
      title = title.toLowerCase();
      if (author != "(auto)" && (title.indexOf(redditTitle) >= 0 || title.replace(/imgur/gi, "reddit").indexOf(redditTitle) >= 0))
        infoContent += "<span class=\"pretty-button\" style=\"background-color: " + sameTitleColor + ";\" title=\"reddit title matches imgur title\">!</span>";
      if (description && title == description.toLowerCase())
        infoContent += "<span class=\"pretty-button\" style=\"background-color: " + sameTitleColor + ";\" title=\"imgur title matches imgur description; this is typical for account farmers\">!!!</span>";
    }
  }
  infoContent += ", ";
  if (height > 0 && size > 0)
    infoContent += width + "x" + height + " ";
  if (!isNaN(size) && size != 0)
  {
    if (colorLargeSize && size > largeSize && /(\.\w{3}|imgur\.com\/[\d\w]{5,8})$/i.test(href))
      infoContent += "<span class=\"pretty-button\" style=\"background-color: " + largeSizeColor + "; color: white;\" title=\"" + size + " bytes\">" + (size / 1024).toFixed(2) + "KB</span>, ";
    else
      infoContent += "<span title=\"" + size + " bytes\">" + (size / 1024).toFixed(2) + "KB</span>, ";
  }
  if (isGallery && isAlbum)
    infoContent += "<span class=\"pretty-button\" style=\"background-color: grey; color: white;\"><a href=\"https://i.imgur.com/" + id + ".jpg\" style=\"color: white;\">gallery album as img</a>(<a href=\"/r/aww/comments/34gm9d/_/cquy6ji?context=1\" style=\"color: white;\">?</a>)</span>, ";
  infoContent += (datetime == 0 ? "??" : "<span title=\"" + timestamp.toString() + "\">T" + dateDiff(diff) + "</span>") + "</span>";
  if (match[3])
    infoContent += "<span class=\"pretty-button\" style=\"background-color: orange; color: white;\" title=\"link uses an imgur suffix that loads a smaller version and will break animated images" + match[3] + "\">thumbnail format</span>";
  $(infoContent).insertAfter($(link).parents(".title"));
  //if (/\/(gallery|t(opic)?)\//i.test(href) || ((/\.com\/.+\.(?!(gifv?$))/i.test(href) || /\.com\/[\d\w]{7,8}(?=[^\d\w]|$)/i.test(href)) && animated) || /\.com\/a\//i.test(href))
  addExpando(entry, entry.find(".imageInfo"), animated, isAlbum, false, id, "https://i.imgur.com/" + id + ".jpg", null, "https://i.imgur.com/" + id + ".mp4");
}

function addExpando(entry, positionElement, video, album, iframe, imgurAlbumId, imgSrc, webmSrc, mp4Src, iframeSrc)
{
  $("<a class=\"" + (video? "video-muted" : "image") + " collapsed collapsedExpando imageInfoExpando\" style=\"float: left; height: 23px; width: 23px; margin: 2px 5px 2px 0px; background-image: url('https://www.redditstatic.com/sprite-reddit.reNnXuo8_bA.png'); background-position: 0px -613px; background-repeat: no-repeat;\"></a>").insertBefore(positionElement); // RES removes .expando-button class elements, need to manually style custom element here as a result
  $("<div class=\"imageInfoExpandoContent\" style=\"display: none; max-width: 100%;\">Loading...</div>").insertAfter(entry.find("ul.flat-list"));
  var expando = entry.find(".imageInfoExpandoContent");
  var albumExpandoData = null;
  if (video && !album)
    entry.find(".imageInfoExpando").click(function()
    {
      if ($(this).hasClass("collapsed"))
      {
        expando.show().html("<video autoplay=\"\" loop=\"\" muted=\"\" preload=\"\" controls=\"\">" + (webmSrc == null ? "" : "<source src=\"" + webmSrc + "\" type=\"video/webm\">") + (mp4Src == null ? "" : "<source src=\"" + mp4Src + "\" type=\"video/mp4\">") + "Video loading failed</video>");
        $(this).addClass("expanded").removeClass("collapsed").css("background-position", "-58px -613px");
        if (!$(this).hasClass("imageInfoAdded"))
          window.setTimeout(function(button)
          {
            addDuration(button);
            if (/gfycat\.com\/(\w+)/i.test(entry.find("a.title").attr("href")))
              $(button).parents(".entry").find("a.title").each(checkLink);
            $(button).addClass("imageInfoAdded");
          }, 300, this);
      }
      else
      {
        expando.hide().html("");
        $(this).addClass("collapsed collapsedExpando").removeClass("expanded").css("background-position", "0px -613px");
      }
    });
  else if (iframe)
    entry.find(".imageInfoExpando").click(function()
    {
      if ($(this).hasClass("collapsed"))
      {
        expando.show().html("<iframe src=\"" + iframeSrc + "\"></iframe>");
        $(this).addClass("expanded").removeClass("collapsed").css("background-position", "-58px -613px");
      }
      else
      {
        expando.hide().html("");
        $(this).addClass("collapsed collapsedExpando").removeClass("expanded").css("background-position", "0px -613px");
      }
    });
  else
    entry.find(".imageInfoExpando").click(function()
    {
      if ($(this).hasClass("collapsed"))
      {
        if (album)
        {
          function albumExpando(data)
          {
            if (data.images && data.images.length > 0)
            {
              var images = data.images;
              expando.html("<span class=\"imageInfoAlbumHeader\" style=\"font-weight: bold;\">" + (data.title ? data.title : "(no title)") + "<br/>" + (data.description ? data.description : "") + "</span><span class=\"imageInfoAlbumControls\" style=\"display: block;\"><a class=\"pretty-button imageInfoAlbumLeft\" style=\"cursor: pointer;\">&lt;</a> <span class=\"imageInfoAlbumCurrentImage\">0</span> of " + images.length + "<a class=\"pretty-button imageInfoAlbumRight\" style=\"cursor: pointer;\">&gt;</a></span><span class=\"imageInfoAlbumCurrentImageTitle\"></span><span class=\"imageInfoAlbumCurrentImageDesc\" style=\"display: block;\"></span><img style=\"display: none; max-width: 100%;\" src=\"\" /><video autoplay=\"\" loop=\"\" muted=\"\" preload=\"\" style=\"display: none;\"><source class=\"imageInfoMp4Src\" type=\"video/mp4\"></video>");
              var currentImage = 0;
              function updateAlbum()
              {
                var img = images[currentImage];
                if (img.animated)
                {
                  expando.find("img").hide();
                  expando.find(".imageInfoMp4Src").attr("src", img.mp4.replace("http:", "https:"));
                  expando.find("video").show()[0].load();
                }
                else
                {
                  expando.find("video").hide();
                  expando.find("img").attr("src", img.link.replace("http:", "https:"));
                  expando.find("img").show();
                }
                expando.find(".imageInfoAlbumCurrentImage").text(currentImage + 1);
                expando.find(".imageInfoAlbumCurrentImageTitle").text(img.title ? img.title : "");
                expando.find(".imageInfoAlbumCurrentImageDesc").text(img.description ? img.description : "");
              }
              expando.find(".imageInfoAlbumLeft").click(function()
              {
                currentImage--;
                if (currentImage < 0)
                  currentImage = images.length - 1;
                updateAlbum();
              });
              expando.find(".imageInfoAlbumRight").click(function()
              {
                currentImage++;
                if (currentImage > images.length - 1)
                  currentImage = 0;
                updateAlbum();
              });
              updateAlbum();
            }
            else
              expando.html("No images found");
          }
          if (albumExpandoData == null)
            $.ajax({
              url: "https://api.imgur.com/3/album/" + imgurAlbumId,
              headers: {"Authorization": "Client-ID " + clientId},
              success: function(data, textStatus, request)
              {
                albumExpandoData = JSON.parse(request.responseText).data;
                albumExpando(albumExpandoData);
              },
              error: function()
              {
                expando.html("Error loading album");
                albumExpandoData = null;
              }
            });
          else
            albumExpando(albumExpandoData);
          expando.show();
        }
        else
          expando.show().html("<img src=\"" + imgSrc + "\" style=\"max-width: 100%;\" />");
        $(this).addClass("expanded").removeClass("collapsed").css("background-position", "-58px -613px");
      }
      else
      {
        expando.hide();
        $(this).addClass("collapsed collapsedExpando").removeClass("expanded").css("background-position", "0px -613px");
      }
    });
}

function gfyFetch()
{
  var button = $(this);
  var entry = button.parents(".entry");
  var link = entry.find("a.title");
  button.text("fetching...");
  $.ajax({
    url: "https://upload.gfycat.com/transcodeRelease?fetchUrl=" + encodeURIComponent($(link).attr("href")),
    success: function(data, textStatus, request)
    {
      var response = JSON.parse(request.responseText);
      if (response.gfyname)
      {
        var gfyUrl = "https://gfycat.com/" + response.gfyName;
        button.text("viewing gfy link").attr("title", "click to view original link");
        $(link).attr("data-prev-href", $(link).attr("href")).attr("data-gfy-href", gfyUrl).attr("href", gfyUrl);
        button.off("click").click(function()
        {
          var link = entry.find("a.title");
          if (link.attr("href") == link.attr("data-prev-href"))
          {
            link.attr("href", link.attr("data-gfy-href"));
            $(this).text("viewing gfy link").attr("title", "click to view original link");
          }
          else
          {
            link.attr("href", link.attr("data-prev-href"));
            $(this).text("viewing original link").attr("title", "click to view gfy link");
          }
        });
        addExpando(entry, button, true, false, false, null, null, response.webmUrl.replace("http:", "https:"), response.mp4Url.replace("http:", "https:"));
      }
      else
        button.text(response.isOk ? "gfy request started" : response.error);
    },
    error: function(request, textStatus, errorThrown)
    {
      console.log("reddit image info error: " + errorThrown);
    }
    });
}

function showGfyInfo(link, gfyItem)
{
  var minLength = (gfyItem.numFrames / (gfyItem.frameRate + 1)).toFixed(1), maxLength = (gfyItem.numFrames / gfyItem.frameRate).toFixed(2);
  var infoContent = "<span style=\"font-size: x-small;\">";
  var directLink = /.com\/\w+\#?$/i.test($(link).attr("href"));
  if (colorLongDuration && minLength >= longDurationMax)
    infoContent += "<span class=\"pretty-button\" style=\"background-color: red; color: white;\">length (approx): " + minLength + " - " + maxLength + "</span>";
  else
    infoContent += "length (approx): " + minLength + " - " + maxLength;
  infoContent += ", " + gfyItem.width + "x" + gfyItem.height;
  if (gfyItem.url != null)
    infoContent += ", <a href=\"" + gfyItem.url + "\">source</a>";
  if (!directLink)
    infoContent += ", <a href=\"https://gfycat.com/" + gfyItem.gfyName + "\">gfy page</a>";
  infoContent += ", " + (gfyItem.webmSize / 1024).toFixed(2) + "KB/";
  if (colorLargeSize && gfyItem.gifSize > largeSize && !directLink)
    infoContent += "<span class=\"pretty-button\" style=\"background-color: " + largeSizeColor + "; color: white;\">" + (gfyItem.gifSize / 1024).toFixed(2) + "KB</span>";
  else
    infoContent += (gfyItem.gifSize / 1024).toFixed(2) + "KB";
  infoContent += "</span>";
  $(infoContent).insertAfter($(link).parents(".title"));
}

function showGiphyInfo(link, giphyItem)
{
  if (giphyItem.length == 0)
    $("<span class=\"imageInfo\" style=\"font-size: x-small;\">no giphy info available</span>").insertAfter($(link).parents(".title"));
  else
  {
    var infoContent = "<span class=\"imageInfo\" style=\"font-size: x-small;\">frames: " + giphyItem.images.original.frames + ", " + giphyItem.images.original.width + "x" + giphyItem.images.original.height;
    if (giphyItem.source != null)
      infoContent += ", <a href=\"" + giphyItem.source + "\">source</a>";
    infoContent += ", <a href=\"" + giphyItem.url + "\">giphy page</a></span>";
    $(infoContent).insertAfter($(link).parents(".title"));
    var entry = $(link).parents(".entry");
    addExpando(entry, entry.find(".imageInfo"), true, false, false, null, null, null, giphyItem.images.original.mp4);
  }
}

function showGifytInfo(link, gifytItem, gifId)
{
  var infoContent = "<span class=\"imageInfo\" style=\"font-size: x-small;\"><a href=\"" + gifytItem.sauce + "\">source</a></span>";
  $(infoContent).insertAfter($(link).parents(".title"));
  var entry = $(link).parents(".entry");
  addExpando(entry, entry.find(".imageInfo"), true, false, false, null, null, null, "https://j.gifs.com/" + gifId + ".mp4");
}

var imgurIdRegex = /imgur\.com\/+(gallery\/|a\/|(?:t(?:opic)?|r)\/[\w]+\/)?([\d\w]{5,7})(s|b|t|m|l|h)?(?=[^\d\w]|$)/i;

function checkLink()
{
  try
  {
    var link = this;
    var href = $(link).attr("href");
    var entry = $(link).parents(".entry");
    var match;
    var contentType;
    var savedValue;
    var gif = "image/gif";
    if (match = href.match(/gfycat\.com\/(\w+)/i))
    {
      $.ajax({
        url: "https://gfycat.com/cajax/get/" + match[1],
        success: function(data, textStatus, request) { showGfyInfo(link, JSON.parse(request.responseText).gfyItem); }
      });
      if (highlightAnimated)
        highlightLink(link, gfyColor);
    }
    else if (match = href.match(/(?:giphy\.com|gph\.is)\/(?:gifs\/|media\/)?(?:\w+\-)*(\w{12,20})/i))
    {
      $.ajax({
        url: "https://api.giphy.com/v1/gifs/" + match[1] + "?api_key=dc6zaTOxFJmzC",
        success: function(data, textStatus, request) { showGiphyInfo(link, JSON.parse(request.responseText).data); }
      });
      if (highlightAnimated)
        highlightLink(link, /\.gif$/i.test(href) ? gifColor : gfyColor);
    }
    else if (match = href.match(/\/\/(?:j\.)?gif(?:youtube|s)\.com\/(?:(?:gif|embed)\/)?(\w+)/i))
    {
      $.ajax({
        url: "https://gifs.com/api/" + match[1],
        success: function(data, textStatus, request) { showGifytInfo(link, JSON.parse(request.responseText), match[1]); }
      });
      if (highlightAnimated)
        highlightLink(link, /\.gif$/i.test(href) ? gifColor : gfyColor);
    }
    else if (match = href.match(imgurIdRegex))
    {
      savedValue = GM_getValue(match[2], null);
      if (savedValue == null)
        $.ajax({
          url: "https://api.imgur.com/3/gallery/" + match[2],
          headers: {"Authorization": "Client-ID " + clientId},
          success: function(data, textStatus, request) { processImgurInfo(link, match, JSON.parse(request.responseText).data); }, // TODO: pass gallery status to processImgurInfo
          error: function(request, textStatus, error)
          {
            if (error == "Not Found")
              $.ajax({
                url: "https://api.imgur.com/3/" + (match[1] == "a/" || (match[2].length < 7 && !/\.com\/.+\./i.test(href)) ? "album" : "image") + "/" + match[2],
                headers: {"Authorization": "Client-ID " + clientId},
                success: function(data, textStatus, request) { processImgurInfo(link, match, JSON.parse(request.responseText).data); },
                error: function(request, textStatus, error)
                {
                  entry.find(".imageInfoRetry").remove();
                  var resp = request.responseText == "" ? null : JSON.parse(request.responseText);
                  $("<a class=\"pretty-button imageInfoRetry\" style=\"background-color: grey; color: white; cursor: pointer;\" title=\"click to retry\">" + (resp != null && resp.data && resp.data.error ? resp.data.error : error) + "</a>").insertAfter($(link).parents(".title"));
                  entry.find(".imageInfoRetry").click(function() { $(this).text("Retrying..."); $(this).parents(".entry").find("a.title").each(checkLink); });
                }
              });
            else
            {
              try {
                  entry.find(".imageInfoRetry").remove();
                  var resp = request.responseText == "" ? null : JSON.parse(request.responseText);
                  $("<a class=\"pretty-button imageInfoRetry\" style=\"background-color: grey; color: white; cursor: pointer;\" title=\"click to retry\">" + (resp != null && resp.data && resp.data.error ? resp.data.error : error) + "</a>").insertAfter($(link).parents(".title"));
                  entry.find(".imageInfoRetry").click(function() { $(this).text("Retrying..."); $(this).parents(".entry").find("a.title").each(checkLink); });
              }
              catch (e)
              {
                console.log(e.message);
                console.log(resp);
                console.log(request);
              }
            }
          }
        });
      else
      {
        savedValue = JSON.parse(savedValue);
        if (savedValue[1] && highlightAnimated)
          highlightLink(link, linkColor(href));
        showImgurInfo(link, match, savedValue[1], savedValue[2], savedValue[3], savedValue[4], savedValue[5], savedValue[6], savedValue[7], savedValue[8], savedValue[9], savedValue[10], savedValue[11], savedValue[12]);
      }
    }
    else if (href.match(/i\.reddituploads\.com/i))
    {
      var infoContent = "<span class=\"imageInfo\" style=\"font-size: x-small;\"></span>";
      $(infoContent).insertAfter($(link).parents(".title"));
      addExpando(entry, entry.find(".imageInfo"), false, false, false, null, href);
    }
    // else if (href.match(/coub2gifv\.me/i))
    // {
      // var infoContent = "<span class=\"imageInfo\" style=\"font-size: x-small;\"></span>";
      // $(infoContent).insertAfter($(link).parents(".title"));
      // addExpando(entry, entry.find(".imageInfo"), false, false, true, null, null, null, null, href);
    // }
    else if (href.match(/\.gif/i) && highlightAnimated)
    {
      // TODO: Fetch image and load info
      highlightLink(link);
      $("<a class=\"gfyLink pretty-button\" style=\"cursor: pointer; margin-right: 5px;\">fetch gfy</a>").insertAfter($(link).parents(".title"));
      entry.find(".gfyLink").click(gfyFetch);
    }
  }
  catch (e)
  {
    console.log(e.message);
    if (e.stack)
      console.log(e.stack);
  }
}

function addDuration(button)
{
  var title = $(button).parent().find("a.title");
  if (title.hasClass("durationadded")) return;
  var vid = $(button).parent().find("video");
  var duration = vid.prop("duration");
  if (vid.length > 0 && !isNaN(duration))
  {
    title.text("[" + duration.toFixed(2) + "] " + title.text());
    if (colorLongDuration && duration >= longDurationMin)
      $(button).parent().attr("style", "background-color: #ff" + ("0" + Math.floor(255 - Math.min(duration - longDurationMin, longDurationMax - longDurationMin) * 255 / (longDurationMax - longDurationMin)).toString(16)).slice(-2) + "00 !important;");
    if (colorLongDuration && duration >= longDurationMax)
      $(button).parent().children("ul.buttons").find("form.remove-button").attr("style", "background-color: #fff").end().find("a.flairselectbtn").attr("style", "background-color: #fff");
    title.addClass("durationadded");
  }
  else
    window.setTimeout(addDuration, 200, button);
}

// Add image info on page load
$(".entry a.title").each(checkLink);

// Add video duration info, hooked to RES inline expandos
window.setTimeout(function()
{
  $("a.toggleImage").click(function()
  {
    window.setTimeout(function(button)
    {
      addDuration(button);
    }, 300, this);
  });
  $("#viewImagesButton").click(function()
  {
    window.setTimeout(function()
    {
      $(".expando-button.expanded").each(function(index)
      {
        window.setTimeout(function(button)
        {
          button.click();
          button.click();
        }, 100 * index, this);
      });
    }, 500);
  });
}, 2500);

function checkComments(comment, imgurComments, depth)
{
  var commentText = comment.text().replace(/\W/g, "");
  if (commentText.length > 5 && commentText != "[deleted]")
  {
    for (var i = 0; i < imgurComments.length; i++)
    {
      var imgurCommentStripped = imgurComments[i].comment.replace(/\W/g, "");
      if (commentText == imgurCommentStripped || commentText == imgurCommentStripped.replace(/imgur(?!\.com)/g, "reddit"))
      {
        var diff = new Date(comment.parents(".entry").find("time").attr("datetime")).getTime() - imgurComments[i].datetime * 1000;
        if (diff > 0)
        {
          var imgurUrl = "https://imgur.com/gallery/" + imgurComments[i].image_id + "/comment/" + imgurComments[i].id + (depth > 0 ? "/" + depth : "");
          $("<a class=\"pretty-button\" style=\"background-color: red; color: white; \" href=\"" + imgurUrl + "\" title=\"" + dateDiff(diff) + "\">imgur comment repost (" + (comment.text() == imgurComments[i].comment ? "exact" : "fuzzy") + ") </a><a class=\"pretty-button imageInfoCommentReport\" style=\"background-color: red; color: white; cursor: pointer;\" onclick=\"var entry = $(this).parents('.entry'); entry.find('a.reportbtn').click(); entry.find('input[value=other]').click(); entry.find('input[name=other_reason]').val('repost bot - " + imgurUrl + "'); entry.find('.submit-action-thing').click();\">Report</a>").insertAfter(comment);
        }
      }
      if (!checkTopLevelCommentsOnly)
        checkComments(comment, imgurComments[i].children, depth + 1);
    }
  }
}

// Imgur comment repost detection
if (highlightImgurCommentReposts && /\/comments\//i.test(window.location.href))
{
  var match = $(".entry a.title").attr("href").match(imgurIdRegex);
  if (match)
  {
    var savedValue = GM_getValue(match[2], null);
    if (savedValue)
    {
      savedValue = JSON.parse(savedValue);
      var isAlbum = savedValue[3];
      $.ajax({
        url: "https://api.imgur.com/3/gallery/" + (isAlbum ? "album" : "image" ) + "/" + match[2] + "/comments/",
        headers: {"Authorization": "Client-ID " + clientId},
        success: function(data, textStatus, request)
        {
          var comments = JSON.parse(request.responseText).data;
          $(".entry .usertext-body p").each(function(){
            checkComments($(this), comments, 0);
          });
        }
      });
    }
  }
}
