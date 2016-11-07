// ==UserScript==
// @name        reddit image info
// @namespace   https://absurdlyobfuscated.com/reddit/
// @description Shows and highlights media/author information from imgur, gfycat, giphy, sli.mg, and more, adds an improved image/video expando, and detects reposted imgur comments.
// @include     https://*.reddit.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require     https://github.com/EastDesire/jscolor/raw/master/jscolor.min.js
// @version     2.0.0.0
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @resource    tagData https://absurdlyobfuscated.com/reddit/reddit_image_info.2.tags.json
// ==/UserScript==

function main()
{
  GM_addStyle(
    ".imageInfoSprite { background-image: url('https://www.redditstatic.com/sprite-reddit.6Om8v6KMv28.png'); }\n" +
    ".imageInfoLink {cursor: pointer;}\n" +
    ".imageInfoButton { display: inline-block; border: 1px solid #666; padding: 1px 6px; border-radius: 3px; font-size: x-small; }\n" +
    ".imageInfoNotification { position: fixed; z-index: 100; top: 44px; right: 47px; padding: 20px; font-size: small; background-color: #eff7ff; }\n" +
    ".imageInfoNotificationClose, .imageInfoSettingsClose { float: right; }\n" +
    ".imageInfoNotificationClose:hover, .imageInfoSettingsClose:hover { background-color: red; color: white; }\n" +
    ".imageInfoSettings { position: absolute; z-index: 100; top: 44px; right: 47px; padding: 10px; font-size: small; background-color: #eff7ff; }\n" +
    ".imageInfoSettingArrayItem { border: 1px solid #cee3f8; margin: 0 0 5px 5px; border-radius: 3px; }\n" +
    ".imageInfoSettingArrayRemove { float: right; position: relative; left: -4px; top: 4px; width: 10px; height: 10px; background-position: -128px -1638px; }\n" +
    ".imageInfoSettingArrayAdd { width: 16px; height: 16px; background-position: 0 -1464px; }\n" +
    ".imageInfoSettingGroup { border: 1px solid #369; border-radius: 3px; margin: 10px 0; }\n" +
    ".imageInfoSettingGroupTitle { background-color: #cee3f8; padding: 5px; }\n" +
    ".imageInfoSettingItem { padding: 3px; }\n" +
    ".imageInfoSettingTitle { display: inline-block; padding-bottom: 5px; }\n" +
    ".imageInfoSettingValue { display: inline; }\n" +
    ".imageInfoSettingValueNonDefault { box-shadow: 0 0 6px yellow; }\n" +
    ".ImageInfoSettingDesc { margin-bottom: 5px; font-size: x-small; background-color: #cee3f8; width: 423px; padding: 5px; }\n" +
    ".imageInfoSettingsButton { display: inline; background-color: #cee3f8; color: #369; font-weight: bold; margin-left: 5px; }\n" +
    ".imageInfoSettingsContent { margin: 10px 0; }\n" +
    ".imageInfoSettingReset, .imageInfoSettingCache, .imageInfoSettingCacheCurrent { float: right; }\n" +
    ".imageInfoAlbumHeader { font-weight: bold; }\n" +
    ".imageInfoAlbumControls, .imageInfoAlbumCurrentImageDesc { display: block; }\n" +
    ".imageInfoAlbumLeft, .imageInfoAlbumRight { background-color: white; }\n" +
    ".imageInfoAlbumRight { margin-left: 3px; }\n" +
    ".imageInfoExpando { float: left; width: 24px; height: 24px; margin: 2px 5px 2px 0px; background-position: -116px -1406px; }\n" +
    ".imageInfoExpando:hover { background-position: -87px -1406px; }\n" +
    ".imageInfoExpandoExpanded { background-position: -29px -1435px; }\n" +
    ".imageInfoExpandoExpanded:hover { background-position: 0 -1435px; }\n" +
    ".imageInfoExpandoContent { display: none; max-width: 100%; }\n" +
    ".imageInfoExpandoImage, .imageInfoExpandoVideo { max-width: 100%; }\n" +
    ".imageInfoRedButton { background-color: red; color: white; }\n" +
    ".imageInfoOrangeButton { background-color: orange; color: white; }\n" +
    ".imageInfoGreyButton { background-color: grey; color: white; }\n" +
    ".imageInfo { font-size: x-small; }\n"
  );

  var settingMetaData = {
    type: "object",
    children: {
      imgurClientId: { name: "Imgur API client ID", type: "string", defaultValue: "2eb3b0a17b566b2", desc: "Client ID used to retrieve imgur info. Get one by registering an imgur app here: <a href=\"https://api.imgur.com/oauth2/addclient\">https://api.imgur.com/oauth2/addclient</a>." },
      slimgClientId: { name: "Sli.mg API client ID", type: "string", defaultValue: "", desc: "Client ID used to retrieve sli.mg info. See <a href=\"https://sli.mg/public/api\">https://sli.mg/public/api</a>." },

      authorTags: { name: "Author tags", type: "array", tooltip: "Tags for imgur/gfycat/etc. media authors.", arrayItem: {
        type: "object", tooltip: "author tag", children: {
          authorRegex: { name: "Author (regex)", type: "string", defaultValue: "", tooltip: "Regular expression used to match media author." },
          tag: { name: "Tag", type: "string", defaultValue: "" },
          tagDetails: { name: "Tag details", type: "string", defaultValue: "", tooltip: "Extra info shown in tag tooltip." },
          tagColor: { name: "Tag highlight color", type: "color", defaultValue: "ff0000" },
          tagTextColor: { name: "Tag text color", type: "color", defaultValue: "ffffff" }
        }
      }, group: "tags" },
      mediaTags: { name: "Media tags", type: "array", tooltip: "Tags for media matching the given width/height/size. Note that this is not very reliable and only matches specific versions of an image/video (and might have false positives).", arrayItem: {
        type: "object", tooltip: "image tag", children: {
          width: { name: "Width", type: "number", defaultValue: 0 },
          height: { name: "Height", type: "number", defaultValue: 0 },
          size: { name: "Size (bytes)", type: "number", defaultValue: 0 },
          tag: { name: "Tag", type: "string", defaultValue: "" },
          tagDetails: { name: "Tag details", type: "string", defaultValue: "", tooltip: "Extra info shown in tag tooltip." },
          tagColor: { name: "Tag highlight color", type: "color", defaultValue: "ff0000" },
          tagTextColor: { name: "Tag text color", type: "color", defaultValue: "ffffff" }
        }
      }, group: "tags" },

      addExpandos: { name: "Add single media item expandos?", type: "boolean", defaultValue: true, group: "expando" },
      addAlbumExpandos: { name: "Add album expandos?", type: "boolean", defaultValue: true, group: "expando" },
      removeNativeExpandos: { name: "Remove native expandos?", type: "boolean", defaultValue: false, group: "expando" },

      highlightAnimated: { name: "Highlight animated media?", type: "boolean", defaultValue: true, tooltip: "Highlights the thumbnail for webm/mp4/GIF/etc. media links.", group: "animated" },
      albumColor: { name: "Album color", type: "color", defaultValue: "d8bfd8", tooltip: "Color for albums containing animated media.", group: "animated" },
      galleryColor: { name: "Gallery color", type: "color", defaultValue: "ee82ee", tooltip: "Color for gallery and image pages containing animated media.", group: "animated" },
      gifvColor: { name: "Gifv color", type: "color", defaultValue: "8a2be2", tooltip: "Color for webm/mp4 compatibility pages.", group: "animated" },
      gfyColor: { name: "Gfy color type", type: "color", defaultValue: "800080", tooltip: "Color for gfycat pages.", group: "animated" },
      webmColor: { name: "Webm color", type: "color", defaultValue: "008080", tooltip: "Color for direct webm/mp4 links.", group: "animated" },
      gifColor: { name: "GIF color", type: "color", defaultValue: "ffa500", tooltip: "Color for direct GIF links.", group: "animated" },

      highlightLongDuration: { name: "Highlight long animated media?", type: "boolean", defaultValue: true, group: "duration" },
      longDuration: { name: "Long duration (seconds)", type: "number", defaultValue: 15, group: "duration" },
      longDurationColor: { name: "Long duration highlight color", type: "color", defaultValue: "ff0000", group: "duration" },
      longDurationTextColor: { name: "Long duration text color", type: "color", defaultValue: "ffffff", group: "duration" },
      useGradient: { name: "Use color gradient?", type: "boolean", defaultValue: true, tooltip: "Yellow to red gradient for long durations, from start to end durations.", group: "duration" },
      gradientDurationMin: { name: "Gradient start duration (seconds)", type: "number", defaultValue: 15, tooltip: "Durations closer to this will be yellow.", group: "duration" },
      gradientDurationMax: { name: "Gradient end duration (seconds)", type: "number", defaultValue: 20, tooltip: "Durations closer to this will be red.", group: "duration" },

      highlightLargeSize: { name: "Highlight large media?", type: "boolean", defaultValue: true, group: "size" },
      largeSize: { name: "Large size (bytes)", type: "number", defaultValue: 15728640, group: "size" },
      largeSizeColor: { name: "Large size highlight color", type: "color", defaultValue: "ff0000", group: "size" },
      largeSizeTextColor: { name: "Large size text color", type: "color", defaultValue: "ffffff", group: "size" },

      highlightLowFrameRate: { name: "Highlight low frame rates?", type: "boolean", defaultValue: true, tooltip: "Frame rates are currently only shown for gfycat links.", group: "frame" },
      lowFrameRate: { name: "Low frame rate", type: "number", defaultValue: 20, group: "frame" },
      lowFrameRateColor: { name: "Low frame rate highlight color", type: "color", defaultValue: "ffa500", group: "frame" },
      lowFrameRateTextColor: { name: "Low frame rate text color", type: "color", defaultValue: "ffffff", group: "frame" },
      highlightHighFrameRate: { name: "Highlight high frame rates?", type: "boolean", defaultValue: true, tooltip: "Frame rates are currently only shown for gfycat links.", group: "frame" },
      highFrameRate: { name: "High frame rate", type: "number", defaultValue: 35, group: "frame" },
      highFrameRateColor: { name: "High frame rate highlight color", type: "color", defaultValue: "0000ff", group: "frame" },
      highFrameRateTextColor: { name: "High frame rate text color", type: "color", defaultValue: "ffffff", group: "frame" },

      highlightLowResolution: { name: "Highlight low resolution media?", type: "boolean", defaultValue: true, group: "res" },
      lowResolution: { name: "Low resolution (pixels)", type: "number", defaultValue: 400, tooltip: "The smaller of width and height considered to be low resolution.", group: "res" },
      lowResolutionColor: { name: "Low resolution color", type: "color", defaultValue: "ffa500", group: "res" },
      imageInfoButton: { name: "Low resolution text color", type: "color", defaultValue: "ffffff", group: "res" },
      highlightHighResolution: { name: "Highlight high resolution media?", type: "boolean", defaultValue: true, group: "res" },
      highResolution: { name: "High resolution (pixels)", type: "number", defaultValue: 2000, tooltip: "The larger of width and height considered to be high resolution.", group: "res" },
      highResolutionColor: { name: "High resolution highlight color", type: "color", defaultValue: "0000ff", group: "res" },
      highResolutionTextColor: { name: "High resolution text color", type: "color", defaultValue: "ffffff", group: "res" },

      highlightSameTitle: { name: "Highlight same titles?", type: "boolean", defaultValue: true, tooltip: "Highlight when the reddit title matches the imgur/gfycat/etc. media title.", group: "sametitle" },
      sameTitleColor: { name: "Same title highlight color", type: "color", defaultValue: "ffff00", group: "sametitle" },
      sameTitleTextColor: { name: "Same title text color", type: "color", defaultValue: "000000", group: "sametitle" },

      highlightSameAuthor: { name: "Highlight same author?", type: "boolean", defaultValue: true, tooltip: "Highlight when the reddit author matches the imgur/gfycat/etc. media author.", group: "sameauthor" },
      sameAuthorColor: { name: "Same author highlight color", type: "color", defaultValue: "008000", group: "sameauthor" },
      sameAuthorTextColor: { name: "Same author text color", type: "color", defaultValue: "ffffff", group: "sameauthor" },

      highlightGalleryReposts: { name: "Highlight gallery reposts?", type: "boolean", defaultValue: true, tooltip: "Highlight when a reddit post is a repost of an imgur gallery post automatically created by a different reddit post.", group: "gallery" },
      galleryRepostColor: { name: "Gallery repost highlight color", type: "color", defaultValue: "ffa500", group: "gallery" },
      galleryRepostTextColor: { name: "Gallery repost text color", type: "color", defaultValue: "ffffff", group: "gallery" },

      highlightThumbnailVersion: { name: "Highlight thumbnail versions?", type: "boolean", defaultValue: true, tooltip: "Highlight when a post links to a smaller or non-standard version of the original.", group: "thumbnail" },
      thumbnailVersionColor: { name: "Thumbnail versions highlight color", type: "color", defaultValue: "ffa500", group: "thumbnail" },
      thumbnailVersionTextColor: { name: "Thumbnail versions text color", type: "color", defaultValue: "ffffff", group: "thumbnail" },

      highlightOld: { name: "Highlight old media items?", type: "boolean", defaultValue: true, group: "old" },
      oldTimeDiff: { name: "Old time (minutes)", type: "number", defaultValue: 24 * 60, group: "old" },
      oldColor: { name: "Old media item highlight color", type: "color", defaultValue: "ffa500", group: "old" },
      oldTextColor: { name: "Old media item text color", type: "color", defaultValue: "ffffff", group: "old" },

      highlightImgurCommentReposts: { name: "Highlight imgur comment reposts?", type: "boolean", defaultValue: true, tooltip: "Highlight when a reddit comment is copied from a comment in the corresponding imgur gallery post for the current reddit post.", group: "imgurrepost" },
      loadImgurCommentsAutomatically: { name: "Load comments automatically?", type: "boolean", defaultValue: true, tooltip: "Automatically retrieve imgur comments on page load. If not enabled, a button will allow you to check manually.", group: "imgurrepost" },
      checkTopLevelCommentsOnly: { name: "Check top level imgur comments only?", type: "boolean", defaultValue: false, tooltip: "Speeds up check time for posts with large numbers of comments, but won't show some comment reposts.", group: "imgurrepost" },
      minimumCommentLength: { name: "Minimum comment length", type: "number", defaultValue: 10, tooltip: "Minimum number of number/letter/space characters in a comment for it to be considered a comment repost.", group: "imgurrepost" },
      reportReasonText: { name: "Report reason text", type: "string", defaultValue: "copied imgur comment - ", tooltip: "Default text inserted in report reason when clicking the Report link on a reposted comment. The imgur comment URL is appended to this text.", group: "imgurrepost" },
      allowEditingOfReportReason: { name: "Allow editing of report reason?", type: "boolean", defaultValue: false, tooltip: "When clicking the Report link on a reposted comment, don't immediately submit the report after filling in the reason.", group: "imgurrepost" },

      imgurPostCacheTime: { name: "Imgur post cache time (minutes)", type: "number", defaultValue: 1 * 60, tooltip: "Time to keep imgur post data (author/description/dimensions/etc.) saved in this script's local cache. Longer times reduce network overhead but media info shown may be out of date. Shorter times increase network overhead (and hit API limits faster) but info will be more up to date.", group: "cache" },
      imgurAlbumCacheTime: { name: "Imgur album cache time (minutes)", type: "number", defaultValue: 2 * 60, tooltip: "Time to keep imgur album data (author/description/list of pictures and their data) cached.", group: "cache" },
      imgurCommentsCacheTime: { name: "Imgur comments cache time (minutes)", type: "number", defaultValue: 2 * 60, tooltip: "Time to keep imgur gallery comments cached.", group: "cache" },
      gfycatPostCacheTime: { name: "Gfycat cache time (minutes)", type: "number", defaultValue: 12 * 60, tooltip: "Time to keep gfycat post data cached.", group: "cache" },
      slimgPostCacheTime: { name: "Slimg post cache time (minutes)", type: "number", defaultValue: 6 * 60, tooltip: "Time to keep slimg post data cached.", group: "cache" },
      slimgAlbumCacheTime: { name: "Slimg album cache time (minutes)", type: "number", defaultValue: 6 * 60, tooltip: "Time to keep slimg album data cached.", group: "cache" },
      otherCacheTime: { name: "Other items cache time (minutes)", type: "number", defaultValue: 12 * 60, tooltip: "Time to keep all other media data cached.", group: "cache" },
    }
  };

  var groupMetaData = {
    expando: { title: "Expandos" },
    tags: { title: "Tags" },
    animated: { title: "Animated" },
    duration: { title: "Long Duration" },
    size: { title: "Large Size" },
    frame: { title: "Frame Rates" },
    res: { title: "Resolution" },
    sametitle: { title: "Same Titles" },
    sameauthor: { title: "Same Authors" },
    gallery: { title: "Gallery Reposts" },
    thumbnail: { title: "Thumbnails" },
    old: { title: "Old Media" },
    imgurrepost: { title: "Imgur Comment Reposts" },
    cache: { title: "Cache" }
  };

  function cacheData(cacheId, dataObject, cacheTimeMinutes)
  {
    GM_setValue(cacheId, JSON.stringify({ exp: cacheTimeMinutes ? Date.now() + cacheTimeMinutes * 60000 : 0, data: dataObject}));
  }

  function getCachedData(cacheId, defaultData, forceExpire)
  {
    var cacheString = GM_getValue(cacheId, null);
    if (cacheString)
    {
      var cacheItem = JSON.parse(cacheString);
      if (cacheItem)
      {
        if (!cacheItem.exp || (!forceExpire && Date.now() < cacheItem.exp))
          return cacheItem.data;
        GM_deleteValue(cacheId);
      }
    }
    return defaultData;
  }

  function getDefaultSettings(metaDataObject)
  {
    var settingValue = {};
    for (var setting in metaDataObject)
    {
      var settingMetaDataObject = metaDataObject[setting];
      if (settingMetaDataObject.type == "array")
        settingValue[setting] = [];
      else if (settingMetaDataObject.type == "object")
        settingValue[setting] = getDefaultSettings(settingMetaDataObject.children);
      else
        settingValue[setting] = settingMetaDataObject.defaultValue;
    }
    return settingValue;
  }

  function cleanCache(forceExpire)
  {
    var removed = 0;
    var startTime = Date.now();
    var keys = GM_listValues();
    for (var i = 0; i < keys.length; i++)
    {
      if (!getCachedData(keys[i], null, forceExpire))
        removed++;
    }
    console.log("reddit image info cache cleanup: " + removed + " removed, " + (keys.length - removed) + " remaining (" + (Date.now() - startTime) + "ms)");
  }

  function showNotification(notification)
  {
    $("body").append($("<div class=\"imageInfoNotification imageInfoButton\"><b>reddit image info</b><div class=\"imageInfoNotificationClose imageInfoLink imageInfoButton\">X</div><div>" + notification + "</div></div>"));
    $(".imageInfoNotificationClose").click(function() {
      $(".imageInfoNotification").remove();
    });
  }

  var settings = getCachedData("rii_settings", null);
  if (!settings)
    settings = getDefaultSettings(settingMetaData.children);
  var isCommentPage = /\/comments\//i.test(window.location.href);
  var currentMediaTag;
  var tagDataJson = GM_getResourceText("tagData");
  var tagData = tagDataJson && JSON.parse(tagDataJson);
  if (!tagData)
    console.log("reddit image info: unable to retrieve tag data");

  function attachEvents(events)
  {
    for (var i = 0; i < events.length; i++)
      $(events[i].id).each(events[i].event);
  }

  function arrayItemHtml(type, setting, metaData, settingValue, parentSetting, events)
  {
    return "<div class=\"imageInfoSettingArrayItem\"><div class=\"imageInfoSettingArrayRemove imageInfoSprite imageInfoLink\" title=\"Remove this " + metaData.tooltip + "\" onclick=\"$(this).parent().remove();\"></div>" + settingHtml(type, setting, metaData, settingValue, parentSetting, null, events) + "</div>";
  }

  function settingHtml(type, setting, metaData, settingValue, parentSetting, lastGroup, events)
  {
    var settingsHtml = "";
    if (metaData.group && metaData.group != lastGroup)
    {
      if (lastGroup)
        settingsHtml += "</div>";
      settingsHtml += "<div class=\"imageInfoSettingGroup\"><div class=\"imageInfoSettingGroupTitle\">" + (groupMetaData[metaData.group] ? groupMetaData[metaData.group].title : metaData.group) + "</div>";
    }
    else if (!metaData.group && lastGroup)
      settingsHtml += "</div>";
    settingsHtml += "<div class=\"imageInfoSettingItem\"><div class=\"imageInfoSettingTitle\" style=\"width: " + (parentSetting ? "250" : "260") + "px;";
    if (metaData.tooltip)
      settingsHtml += "\" title=\"" + metaData.tooltip;
    settingsHtml += "\">";
    if (metaData.name)
      settingsHtml += metaData.name;
    settingsHtml += "</div><div class=\"imageInfoSettingValue";
    if (typeof settingValue == "undefined")
      settingValue = metaData.defaultValue;
    if (type != "array" && type != "object" && metaData.defaultValue && settingValue != metaData.defaultValue)
      settingsHtml += " imageInfoSettingValueNonDefault\" title=\"default value: " + (type == "string" ? "&quot;" + metaData.defaultValue + "&quot;" : metaData.defaultValue);
    settingsHtml += "\">";
    switch (type)
    {
      case "color":
        settingsHtml += "<input type=\"text\" class=\"imageInfoSetting jscolor\" id=\"" + setting + "\"";
        if (parentSetting)
          settingsHtml += " data-parent=\"" + parentSetting + "\" />";
        events.push({
          id: "#" + setting,
          event: function() {
            var picker = new jscolor(this, { uppercase: false });
            picker.fromString(settingValue);
          }
        });
        break;
      case "string":
      case "number":
        settingsHtml += "<input type=\"text\" class=\"imageInfoSetting\" id=\"" + setting + "\"";
        if (parentSetting)
          settingsHtml += " data-parent=\"" + parentSetting + "\"";
        settingsHtml += " value=\"" + settingValue + "\" />";
        break;
      case "boolean":
        settingsHtml += "<input type=\"checkbox\" class=\"imageInfoSetting\" id=\"" + setting + "\"";
        if (parentSetting)
          settingsHtml += " data-parent=\"" + parentSetting + "\"";
        settingsHtml += (settingValue ? "checked=\"checked\"" : "") + " />";
        break;
      case "array":
        settingsHtml += "<div class=\"imageInfoSetting\"";
        if (parentSetting)
          settingsHtml += " data-parent=\"" + parentSetting;
        settingsHtml += "\" id=\"" + setting + "\">";
        for (var i = 0; i < settingValue.length; i++)
          settingsHtml += arrayItemHtml(metaData.arrayItem.type, setting + "_" + i, metaData.arrayItem, settingValue[i], setting, events);
        settingsHtml += "</div><div class=\"imageInfoSettingArrayAdd imageInfoSprite imageInfoLink\" id=\"imageInfoSettingArrayAdd" + setting + "\" title=\"Add new " + metaData.arrayItem.tooltip + "\" />";
        var nextIndex = settingValue.length;
        events.push({
          id: "#imageInfoSettingArrayAdd" + setting,
          event: function() {
            $(this).click(function() {
              var newEvents = [];
              $("#" + setting).append($(arrayItemHtml(metaData.arrayItem.type, setting + "_" + (nextIndex++), metaData.arrayItem, metaData.arrayItem.defaultValue, setting, newEvents)));
              attachEvents(newEvents);
            });
          }
        });
        break;
      case "object":
        settingsHtml += "<div class=\"imageInfoSetting\"";
        if (parentSetting)
          settingsHtml += " data-parent=\"" + parentSetting;
        settingsHtml += "\" id=\"" + setting + "\">";
        var childLastGroup;
        for (var childSetting in metaData.children)
        {
          var childSettingMetaData = metaData.children[childSetting];
          settingsHtml += settingHtml(childSettingMetaData.type, setting + "_" + childSetting, childSettingMetaData, settingValue ? settingValue[childSetting] : childSettingMetaData.defaultValue, setting, childLastGroup, events);
          childLastGroup = childSettingMetaData.group;
        }
        if (childLastGroup)
          settingsHtml += "</div>";
        settingsHtml += "</div>";
        break;
    }
    settingsHtml += "</div>";
    if (metaData && metaData.desc)
      settingsHtml += "<div class=\"ImageInfoSettingDesc\">" + metaData.desc + "</div>";
    settingsHtml += "</div>";
    return settingsHtml;
  }

  function readSetting(type, setting, metaData, settingInput, parentSetting)
  {
    var valid = true;
    var settingValue;
    switch (type)
    {
      case "color":
      case "string":
        settingValue = settingInput.val();
        break;
      case "number":
        var value = +settingInput.val();
        if (isNaN(value))
        {
          showNotification("Invalid numeric value for setting " + metaData.name + ": " + settingInput.val());
          valid = false;
          break;
        }
        settingValue = value;
        break;
      case "boolean":
        settingValue = settingInput.prop("checked");
        break;
      case "array":
          var settingArray = [];
          $(".imageInfoSetting[data-parent=" + setting + "]").each(function() {
            settingArray.push(readSetting(metaData.arrayItem.type, $(this).attr("id"), metaData.arrayItem, $(this), setting));
          });
          settingValue = settingArray;
        break;
      case "object":
        var settingObj = {};
        for (var childSetting in metaData.children)
        {
          var childSettingMetaData = metaData.children[childSetting];
          settingObj[childSetting] = readSetting(childSettingMetaData.type, setting + "_" + childSetting, childSettingMetaData, $("#" + setting + "_" + childSetting), setting);
        }
        settingValue = settingObj;
        break;
    }
    if (!valid)
      throw new Error("invalid");
    return settingValue;
  }

  function settingDiffText(settingName, metaData, settingValue)
  {
    var diffText = "";
    if (metaData.type == "array")
    {
      if (!settingValue)
        diffText += settingName + "\n";
      else
      {
        for (var i = 0; i < settingValue.length; i++)
          diffText += settingDiffText(settingName + " > Item " + i, metaData.arrayItem, settingValue[i]);
      }
    }
    else if (metaData.type == "object")
    {
      if (!settingValue)
        diffText += settingName + "\n";
      else
      {
        for (var childSetting in metaData.children)
          diffText += settingDiffText((settingName ? settingName + " > " : "") + (metaData.children[childSetting].name || childSetting), metaData.children[childSetting], settingValue[childSetting]);
      }
    }
    else if (settingValue != metaData.defaultValue)
      diffText += settingName + ": " + metaData.defaultValue + " => " + settingValue + "\n";
    return diffText;
  }

  $("#header-bottom-right").find("ul").append($("<li><a class=\"imageInfoSettingsButton imageInfoLink imageInfoButton\" title=\"reddit image info settings\">rii</a></li>"));
  $(".imageInfoSettingsButton").click(function() {
    $(".imageInfoSettings").remove();
    var events = [];
    var settingsHtml = "<div class=\"imageInfoSettings imageInfoButton\"><b>reddit image info settings:</b><div class=\"imageInfoSettingsClose imageInfoButton imageInfoLink\">X</div><div class=\"imageInfoSettingsContent\">";
    settingsHtml += settingHtml("object", "imageInfoSetting", settingMetaData, settings, null, null, events);
    settingsHtml += "</div><input type=\"button\" class=\"imageInfoSettingSave\" value=\"Save\" /><input type=\"button\" class=\"imageInfoSettingReset\" value=\"Reset\" /><input type=\"button\" class=\"imageInfoSettingCache\" value=\"Clear Cache\" />";
    if (currentMediaTag)
      settingsHtml += "<input type=\"button\" class=\"imageInfoSettingCacheCurrent\" value=\"Clear Current Page Cache\" />";
    settingsHtml += "</div>";
    $("body").append($(settingsHtml));
    attachEvents(events);
    $(".imageInfoSettingSave").click(function() {
      try
      {
        settings = readSetting("object", "imageInfoSetting", settingMetaData, null, null);
        cacheData("rii_settings", settings);
        $(".imageInfoSettings").remove();
        showNotification("Settings saved. Refresh page to update.");
      }
      catch (e)
      {
        if (e.message != "invalid")
          showNotification(e.message);
      }
    });
    $(".imageInfoSettingsClose").click(function() {
      $(".imageInfoSettings").remove();
    });
    $(".imageInfoSettingReset").click(function() {
      var diffText = settingDiffText("", settingMetaData, settings);
      if (!diffText)
        showNotification("All settings have their default value.");
      else if (confirm("Reset all reddit image info settings?\n\nYou have modified these settings:\n\n" + diffText))
      {
        settings = getDefaultSettings(settingMetaData.children);
        cacheData("rii_settings", settings);
        $(".imageInfoSettings").remove();
        showNotification("Settings reset. Refresh page to update.");
      }
    });
    $(".imageInfoSettingCache").click(function() {
      cleanCache(true);
      showNotification("Cache cleared");
    });
    $(".imageInfoSettingCacheCurrent").click(function() {
      GM_deleteValue(currentMediaTag);
      GM_deleteValue(currentMediaTag + "-a");
      GM_deleteValue(currentMediaTag + "-c");
      showNotification("Cache for current page cleared");
    });
  });

  window.setTimeout(function() {
    cleanCache(false);
  }, 30000);

  // https://gist.github.com/dperini/729294#file-regex-weburl-js
  var urlRegex = /(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?/i;

  function linkify(str)
  {
    if (str.indexOf("<a ") > -1)
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

  function dateDiff(diff)
  {
    return (diff < 0 ? "+" : "-") + (Math.abs(diff / 24 / 60 / 60 / 1000) >= 1 ? Math.floor(Math.abs(diff / 24 / 60 / 60 / 1000)) + "D " : "") + zp2(Math.floor(Math.abs(diff / 60 / 60 / 1000)) % 24) + ":" + zp2(Math.floor(Math.abs(diff / 60 / 1000)) % 60) + ":" + zp2(Math.floor(Math.abs(diff / 1000)) % 60);
  }

  function linkColor(href)
  {
    if (/\/a\/[\d\w]+/i.test(href))
      return settings.albumColor;
    if (/\.gifv$/i.test(href))
      return settings.gifvColor;
    if (/\.(webm|mp4)$/i.test(href))
      return settings.webmColor;
    if (/\.\w+((\?|#).+)?$/i.test(href))
      return settings.gifColor;
    return settings.galleryColor;
  }

  function durationColor(duration)
  {
    if (settings.useGradient)
      return "ff" + ("0" + Math.floor(255 - Math.min(duration - settings.gradientDurationMin, settings.gradientDurationMax - settings.gradientDurationMin) * 255 / (settings.gradientDurationMax - settings.gradientDurationMin)).toString(16)).slice(-2) + "00";
    return settings.longDurationColor;
  }

  function durationTextColor(duration)
  {
    if (settings.useGradient)
      return Math.min(duration - settings.gradientDurationMin, settings.gradientDurationMax - settings.gradientDurationMin) / (settings.gradientDurationMax - settings.gradientDurationMin) > 0.2 ? "fff" : "000";
    return settings.longDurationTextColor;
  }

  function highlightLink(link, color)
  {
    if (!color)
      color = "f00";
    link.parents("div.link").find("a.thumbnail").first().attr("style", "border: 3px solid #" + color + " !important");
  }

  function getAuthorTagHtml(authorTags, authorName)
  {
    var tagHtml = "";
    for (i = 0; i < authorTags.length; i++)
    {
      var authorTag = authorTags[i];
      if (authorTag.tag && new RegExp(authorTag.authorRegex, "i").test(authorName))
        tagHtml += " <span class=\"imageInfoButton\" style=\"background-color: #" + authorTag.tagColor + "; color: #" + authorTag.tagTextColor + ";\"" + (authorTag.tagDetails ? " title=\"" + authorTag.tagDetails + "\"" : "") + ">" + authorTag.tag + "</span>";
    }
    return tagHtml;
  }

  function showMediaInfo(link, mediaInfo)
  {
    var entry = link.parents(".entry");
    var timestamp = new Date(mediaInfo.datetime);
    var diff = new Date(entry.find("time").attr("datetime")).getTime() - mediaInfo.datetime;
    var infoHtml = "<span class=\"imageInfo\">";
    if (mediaInfo.authorName)
    {
      if (mediaInfo.authorLink)
        infoHtml += "<a href=\"" + mediaInfo.authorLink + "\">" + mediaInfo.authorName + "</a>";
      else
        infoHtml += mediaInfo.authorName;
      if (mediaInfo.authorAltLink)
        infoHtml += " (<a href=\"" + mediaInfo.authorAltLink + "\">" + mediaInfo.authorAltLinkName + "</a>)";
      if (tagData && tagData.authorTags)
        infoHtml += getAuthorTagHtml(tagData.authorTags, mediaInfo.authorName);
      if (settings.authorTags)
        infoHtml += getAuthorTagHtml(settings.authorTags, mediaInfo.authorName);
      if (settings.highlightSameAuthor && mediaInfo.authorName.toLowerCase() == entry.find("p.tagline a.author").text().toLowerCase().replace(/[\-_]/g, ""))
        infoHtml += " <span class=\"imageInfoButton\" style=\"background-color: #" + settings.sameAuthorColor + "; color: #" + settings.sameAuthorTextColor + ";\" title=\"reddit author matches " + mediaInfo.mediaName + " author\">=</span>";
      infoHtml += ", ";
    }
    infoHtml += "<a href=\"" + mediaInfo.pageLink + "\">" + mediaInfo.pageLinkText + "</a>, ";
    if (mediaInfo.mediaTagHtml)
      infoHtml += mediaInfo.mediaTagHtml + " ";
    if (mediaInfo.rating)
      infoHtml += "<span class=\"" + (mediaInfo.rating == "R" || mediaInfo.rating == "NSFW" ? "nsfw-stamp " : "") + "stamp\">" + mediaInfo.rating + "</span> ";
    if (mediaInfo.source)
      infoHtml += "<a href=\"" + mediaInfo.source + "\">source</a>, ";
    if (mediaInfo.duration)
    {
      if (settings.highlightLongDuration && (mediaInfo.duration >= settings.gradientDurationMin || mediaInfo.duration >= settings.longDuration))
        infoHtml += "<span class=\"imageInfoButton\" style=\"background-color: #" + durationColor(mediaInfo.duration) + "; color: #" + durationTextColor(duration) + ";\">" + mediaInfo.duration + "s</span> ";
      else
        infoHtml += mediaInfo.duration + "s, ";
    }
    else if (mediaInfo.minDuration && mediaInfo.maxDuration)
    {
      if (settings.highlightLongDuration && (mediaInfo.minDuration >= settings.gradientDurationMin || mediaInfo.minDuration >= settings.longDuration))
        infoHtml += "<span class=\"imageInfoButton\" style=\"background-color: #" + durationColor(mediaInfo.minDuration) + "; color: #" + durationTextColor(mediaInfo.minDuration) + ";\">" + mediaInfo.minDuration + "s - " + mediaInfo.maxDuration + "s</span> ";
      else
        infoHtml += mediaInfo.minDuration + "s - " + mediaInfo.maxDuration + "s, ";
    }
    if (mediaInfo.frameRate || (mediaInfo.frames && (mediaInfo.duration || mediaInfo.maxDuration)))
    {
      if (!mediaInfo.frameRate)
        mediaInfo.frameRate = mediaInfo.frames / (mediaInfo.duration || mediaInfo.maxDuration);
      infoHtml += "<span ";
      if (settings.highlightLowFrameRate && mediaInfo.frameRate < settings.lowFrameRate)
        infoHtml += "class=\"imageInfoButton\" style=\"background-color: #" + settings.lowFrameRateColor + "; color: #" + settings.lowFrameRateTextColor + ";\"";
      else if (settings.highlightHighFrameRate && mediaInfo.frameRate > settings.highFrameRate)
        infoHtml += "class=\"imageInfoButton\" style=\"background-color: #" + settings.highFrameRateColor + "; color: #" + settings.highFrameRateTextColor + ";\"";
      if (mediaInfo.frames)
        infoHtml += "title=\"frames: " + mediaInfo.frames + "\"";
      infoHtml += ">" + (+mediaInfo.frameRate).toFixed(2) + " FPS</span>, ";
    }
    else if (mediaInfo.frames)
      infoHtml += "frames: " + mediaInfo.frames + ", ";
    if (mediaInfo.width && mediaInfo.height)
    {
      infoHtml += "<span";
      if (settings.highlightLowResolution && Math.min(mediaInfo.width, mediaInfo.height) < settings.lowResolution)
        infoHtml += " class=\"imageInfoButton\" style=\"background-color: #" + settings.lowResolutionColor + "; color: #" + settings.lowResolutionTextColor + ";\"";
      else if (settings.highlightHighResolution && Math.min(mediaInfo.width, mediaInfo.height) > settings.highResolution)
        infoHtml += " class=\"imageInfoButton\" style=\"background-color: #" + settings.highResolutionColor + "; color: #" + settings.highResolutionTextColor + ";\"";
      infoHtml += ">" + mediaInfo.width + "x" + mediaInfo.height + "</span>, ";
    }
    if (mediaInfo.videoSize)
    {
      if (settings.highlightLargeSize && mediaInfo.videoSize > settings.largeSize)
        infoHtml += "<span class=\"imageInfoButton\" style=\"background-color: #" + settings.largeSizeColor + "; color: #" + settings.largeSizeTextColor + ";\" title=\"" + mediaInfo.videoSize + " bytes\">" + (mediaInfo.videoSize / 1024).toFixed(2) + " KB</span>";
      else
        infoHtml += "<span title=\"" + mediaInfo.videoSize + " bytes\">" + (mediaInfo.videoSize / 1024).toFixed(2) + " KB</span>";
      if (mediaInfo.imageSize)
        infoHtml +=  " / ";
      else
        infoHtml +=  ", ";
    }
    if (mediaInfo.imageSize)
    {
      if (settings.highlightLargeSize && mediaInfo.imageSize > settings.largeSize && (!mediaInfo.isVideoLink || !mediaInfo.videoSize))
        infoHtml += "<span class=\"imageInfoButton\" style=\"background-color: #" + settings.largeSizeColor + "; color: #" + settings.largeSizeTextColor + ";\" title=\"" + mediaInfo.imageSize + " bytes\">" + (mediaInfo.imageSize / 1024).toFixed(2) + " KB</span>, ";
      else
        infoHtml += "<span title=\"" + mediaInfo.imageSize + " bytes\">" + (mediaInfo.imageSize / 1024).toFixed(2) + " KB</span>, ";
    }
    if (mediaInfo.datetime)
    {
      infoHtml += "<span ";
      if (settings.highlightOld && diff > settings.oldTimeDiff * 60000)
        infoHtml += "class=\"imageInfoButton\" style=\"background-color: #" + settings.oldColor + "; color: #" + settings.oldTextColor + ";\" ";
      infoHtml += "title=\"" + timestamp.toGMTString() + "\">T" + dateDiff(diff) + "</span>";
    }
    else
      infoHtml += "T?";
    if (mediaInfo.title)
    {
      infoHtml += ", ";
      if (settings.highlightSameTitle)
      {
        var redditTitle = link.text().toLowerCase();
        var checkTitle = mediaInfo.title.replace(/ +/g, " ").toLowerCase();
        var checkTitleAlt = checkTitle.replace(/imgur/gi, "reddit");
        if (checkTitle.indexOf(redditTitle) >= 0 || checkTitleAlt.indexOf(redditTitle) >= 0 || checkTitleAlt.replace(/(^|\W)(i|me|my|mine|myself|we|us|our|ours|ourselves|meet|itap)(\W|$)/gi).indexOf(redditTitle) >= 0)
          infoHtml += "<span class=\"imageInfoButton\" style=\"background-color: #" + settings.sameTitleColor + "; color: #" + settings.sameTitleTextColor + ";\" title=\"reddit title matches " + mediaInfo.mediaName + " title\">same title</span> ";
        if (mediaInfo.description && mediaInfo.title == mediaInfo.description)
          infoHtml += "<span class=\"imageInfoButton\" style=\"background-color: #" + settings.sameTitleColor + "; color: #" + settings.sameTitleTextColor + ";\" title=\"" + mediaInfo.mediaName + " title matches " + mediaInfo.mediaName + " description, this is common with account farmers\">title/description match</span> ";
      }
      if (mediaInfo.tags)
        infoHtml += "[" + mediaInfo.tags + "] ";
      infoHtml += "\"" + mediaInfo.title + (mediaInfo.description ? " /// " + linkify(mediaInfo.description).replace(/\n/g, " // ") : "") + "\"";
    }
    infoHtml += "</span>";
    $(infoHtml).insertAfter(link.parents(".title"));
  }

  function getMediaTagHtml(mediaTags, width, height, size)
  {
    var tagHtml = "";
    for (i = 0; i < mediaTags.length; i++)
    {
      var imgTag = mediaTags[i];
      if (imgTag.tag && imgTag.width == width && imgTag.height == height && imgTag.size == size)
        tagHtml += "<span class=\"imageInfoButton\" style=\"background-color: #" + imgTag.tagColor + "; color: #" + imgTag.tagTextColor + ";\"" + (imgTag.tagDetails ? " title=\"" + imgTag.tagDetails + "\"" : "") + ">" + imgTag.tag + "</span> ";
    }
    return tagHtml;
  }

  function updateImgurAlbum(expando, currentImage, images)
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

  function imgurAlbumExpando(expando, albumData)
  {
    var images = albumData.images;
    if (images && images.length > 0)
    {
      expando.html("<span class=\"imageInfoAlbumHeader\">" + (albumData.title ? albumData.title : "(no title)") + "<br/>" + (albumData.description ? albumData.description : "") + "</span><span class=\"imageInfoAlbumControls\"><a class=\"imageInfoAlbumLeft imageInfoButton imageInfoLink\">&lt;</a> <span class=\"imageInfoAlbumCurrentImage\">0</span> of " + images.length + "<a class=\"imageInfoAlbumRight imageInfoButton imageInfoLink\">&gt;</a></span><span class=\"imageInfoAlbumCurrentImageTitle\"></span><span class=\"imageInfoAlbumCurrentImageDesc\"></span><img class=\"imageInfoExpandoContent\" src=\"\" /><video class=\"imageInfoExpandoContent\" autoplay=\"\" loop=\"\" muted=\"\" preload=\"\"><source class=\"imageInfoMp4Src\" type=\"video/mp4\"></video>");
      var currentImage = 0;
      expando.find(".imageInfoAlbumLeft").click(function() {
        currentImage--;
        if (currentImage < 0)
          currentImage = images.length - 1;
        updateImgurAlbum(expando, currentImage, images);
      });
      expando.find(".imageInfoAlbumRight").click(function() {
        currentImage++;
        if (currentImage > images.length - 1)
          currentImage = 0;
        updateImgurAlbum(expando, currentImage, images);
      });
      updateImgurAlbum(expando, currentImage, images);
    }
    else
      expando.html("No images found");
  }

  function updateSlimgAlbum(expando, currentImage, images)
  {
    var img = images[currentImage];
    if (img.animated)
    {
      expando.find("img").hide();
      expando.find(".imageInfoMp4Src").attr("src", img.mp4);
      expando.find("video").show()[0].load();
    }
    else
    {
      expando.find("video").hide();
      expando.find("img").attr("src", img.url_direct);
      expando.find("img").show();
    }
    expando.find(".imageInfoAlbumCurrentImage").text(currentImage + 1);
    expando.find(".imageInfoAlbumCurrentImageTitle").text(img.title ? img.title : "");
    expando.find(".imageInfoAlbumCurrentImageDesc").text(img.description ? img.description : "");
  }

  function slimgAlbumExpando(expando, albumData, slimgItem)
  {
    var images = albumData.media;
    var mediaTagHtml = "";
    if (images && images.length > 0)
    {
      for (var i = 0; i < images.length; i++)
      {
        if (tagData && tagData.mediaTags)
          mediaTagHtml += getMediaTagHtml(tagData.mediaTags, images[i].width, images[i].height, images[i].size);
        if (settings.mediaTags)
          mediaTagHtml += getMediaTagHtml(settings.mediaTags, images[i].width, images[i].height, images[i].size);
        if (settings.highlightAnimated && images[i].animated)
        {
          var link = expando.parent().parent().find("a.thumbnail");
          highlightLink(link, settings.albumColor);
        }
      }
      expando.html("<span class=\"imageInfoAlbumHeader\">" + (slimgItem.description ? slimgItem.description : "") + "</span>" + mediaTagHtml + "<span class=\"imageInfoAlbumControls\"><a class=\"imageInfoAlbumLeft imageInfoButton imageInfoLink\">&lt;</a> <span class=\"imageInfoAlbumCurrentImage\">0</span> of " + images.length + "<a class=\"imageInfoAlbumRight imageInfoButton imageInfoLink\">&gt;</a></span><span class=\"imageInfoAlbumCurrentImageTitle\"></span><span class=\"imageInfoAlbumCurrentImageDesc\"></span><img class=\"imageInfoExpandoContent\" src=\"\" /><video class=\"imageInfoExpandoContent\" autoplay=\"\" loop=\"\" muted=\"\" preload=\"\"><source class=\"imageInfoMp4Src\" type=\"video/mp4\"></video>");
      var currentImage = 0;
      expando.find(".imageInfoAlbumLeft").click(function() {
        currentImage--;
        if (currentImage < 0)
          currentImage = images.length - 1;
        updateSlimgAlbum(expando, currentImage, images);
      });
      expando.find(".imageInfoAlbumRight").click(function() {
        currentImage++;
        if (currentImage > images.length - 1)
          currentImage = 0;
        updateSlimgAlbum(expando, currentImage, images);
      });
      updateSlimgAlbum(expando, currentImage, images);
    }
    else
      expando.html("No images found");
  }

  function addExpando(entry, positionElement, album, iframe, imgurAlbumId, slimgItem, imgSrc, videoSrc, iframeSrc)
  {
    if (!album && !settings.addExpandos || album && !settings.addAlbumExpandos)
      return;
    $("<a class=\"imageInfoExpando imageInfoExpandoCollapsed imageInfoSprite imageInfoLink\"></a>").insertBefore(positionElement);
    $("<div class=\"imageInfoExpandoContent\">Loading...</div>").insertAfter(entry.find("ul.flat-list"));
    var expando = entry.find(".imageInfoExpandoContent");
    var albumExpandoData;
    if (videoSrc)
      entry.find(".imageInfoExpando").click(function() {
        if ($(this).hasClass("imageInfoExpandoCollapsed"))
        {
          expando.show().html("<video class=\"imageInfoExpandoVideo\" src=\"" + videoSrc + "\" autoplay=\"\" loop=\"\" muted=\"\" preload=\"\" controls=\"\">" + (imgSrc ? "<img class=\"imageInfoExpandoImage\" src=\"" + imgSrc + "\" />" : "Video failed to load") + "</video>");
          $(this).addClass("imageInfoExpandoExpanded").removeClass("imageInfoExpandoCollapsed");
          if (!$(this).hasClass("imageInfoAdded"))
            window.setTimeout(function(button) {
              addDuration(button);
              $(button).addClass("imageInfoAdded");
            }, 300, this);
        }
        else
        {
          expando.hide().html("");
          $(this).addClass("imageInfoExpandoCollapsed").removeClass("imageInfoExpandoExpanded");
        }
      });
    else if (iframe)
      entry.find(".imageInfoExpando").click(function() {
        if ($(this).hasClass("imageInfoExpandoCollapsed"))
        {
          expando.show().html("<iframe src=\"" + iframeSrc + "\"></iframe>");
          $(this).addClass("imageInfoExpandoExpanded").removeClass("imageInfoExpandoCollapsed");
        }
        else
        {
          expando.hide().html("");
          $(this).addClass("imageInfoExpandoCollapsed").removeClass("imageInfoExpandoExpanded");
        }
      });
    else
      entry.find(".imageInfoExpando").click(function() {
        if ($(this).hasClass("imageInfoExpandoCollapsed"))
        {
          if (album)
          {
            if (imgurAlbumId)
            {
              albumExpandoData = getCachedData(imgurAlbumId + "-a", null);
              if (albumExpandoData)
                imgurAlbumExpando(expando, albumExpandoData);
              else
              {
                if (!settings.imgurClientId)
                  showNotification("Imgur client ID required. Set one in the reddit image info options.");
                else
                  $.ajax({
                    url: "https://api.imgur.com/3/album/" + imgurAlbumId,
                    headers: {"Authorization": "Client-ID " + settings.imgurClientId},
                    success: function(data, textStatus, request) {
                      albumExpandoData = JSON.parse(request.responseText).data;
                      imgurAlbumExpando(expando, albumExpandoData);
                      cacheData(imgurAlbumId + "-a", albumExpandoData, settings.imgurAlbumCacheTime);
                    },
                    error: function() {
                      expando.html("Error loading album");
                    }
                  });
              }
            }
            else if (slimgItem)
            {
              albumExpandoData = getCachedData(slimgItem.album_key + "-a", null);
              if (albumExpandoData)
                slimgAlbumExpando(expando, albumExpandoData, slimgItem);
              else
              {
                if (!settings.slimgClientId)
                  showNotification("Slimg client ID required. Set one in the reddit image info options.");
                else
                {
                  $.ajax({
                    url: "https://api.sli.mg/album/" + slimgItem.album_key + "/media",
                    headers: {"Authorization": "Client-ID " + settings.slimgClientId},
                    success: function(data, textStatus, request) {
                      albumExpandoData = JSON.parse(request.responseText).data;
                      slimgAlbumExpando(expando, albumExpandoData, slimgItem);
                      cacheData(slimgItem.album_key + "-a", albumExpandoData, settings.slimgAlbumCacheTime);
                    },
                    error: function() {
                      expando.html("Error loading album");
                    }
                  });
                }
              }
            }
            expando.show();
          }
          else
            expando.show().html("<img class=\"imageInfoExpandoImage\" src=\"" + imgSrc + "\" />");
          $(this).addClass("imageInfoExpandoExpanded").removeClass("imageInfoExpandoCollapsed");
        }
        else
        {
          expando.hide();
          $(this).addClass("imageInfoExpandoCollapsed").removeClass("imageInfoExpandoExpanded");
        }
      });
    if (settings.removeNativeExpandos)
      entry.find(".expando-button").remove();
  }

  function showImgurInfo(link, match, data)
  {
    var id = match[2];
    var entry = link.parents(".entry");
    var href = link.attr("href");
    var author = data.account_url;
    var diff = new Date(entry.find("time").attr("datetime")).getTime() - data.datetime * 1000;
    var mediaTagHtml = "";
    if (settings.highlightGalleryReposts && data.in_gallery && !author && Math.abs(diff) > 1200000)
      mediaTagHtml += "<span class=\"imageInfoButton\" style=\"background-color: #" + settings.galleryRepostColor + "; color: #" + settings.galleryRepostTextColor + ";\" title=\"it appears that this is a repost of an imgur gallery post automatically created by a different reddit post\">reposted auto gallery post</span> ";
    if (settings.highlightThumbnailVersion && match[3])
      mediaTagHtml += "<span class=\"imageInfoButton\" style=\"background-color: #" + settings.thumbnailVersionColor + "; color: #" + settings.thumbnailVersionTextColor + ";\" title=\"link uses an imgur suffix that loads a smaller version and will break animated images - see https://api.imgur.com/models/image\">thumbnail format</span>";
    if (data.images)
    {
      var images = data.images;
      for (var i = 0; i < images.length; i++)
      {
        if (tagData && tagData.mediaTags)
          mediaTagHtml += getMediaTagHtml(tagData.mediaTags, images[i].width, images[i].height, images[i].size);
        if (settings.mediaTags)
          mediaTagHtml += getMediaTagHtml(settings.mediaTags, images[i].width, images[i].height, images[i].size);
        if (settings.highlightAnimated && images[i].animated)
          highlightLink(link, settings.albumColor);
      }
      showMediaInfo(link, {
        mediaName: "imgur",
        authorName: author,
        authorLink: "https://imgur.com/user/" + author + "/submitted",
        authorAltLinkName: "comments",
        authorAltLink: "https://imgur.com/user/" + author,
        pageLink: "https://imgur.com/" + (data.in_gallery ? "gallery/" : "a/") + id,
        pageLinkText: "imgur " + (data.in_gallery ? "gallery" : "album") + " page",
        mediaTagHtml: mediaTagHtml,
        datetime: data.datetime * 1000,
        title: data.title,
        description: data.description,
        tags: data.topic || data.section,
        rating: data.nsfw ? "NSFW" : null
      });
      addExpando(entry, entry.find(".imageInfo"), true, false, id);
    }
    else
    {
      if (tagData && tagData.mediaTags)
        mediaTagHtml += getMediaTagHtml(tagData.mediaTags, data.width, data.height, data.size);
      if (settings.mediaTags)
        mediaTagHtml += getMediaTagHtml(settings.mediaTags, data.width, data.height, data.size);
      if (settings.highlightAnimated && data.animated)
        highlightLink(link, linkColor(href));
      showMediaInfo(link, {
        mediaName: "imgur",
        isVideoLink: /\/[\d\w]{5,8}\.(mp4|webm|gifv)((#|\?).+)?$/i.test(href),
        authorName: author,
        authorLink: "https://imgur.com/user/" + author + "/submitted",
        authorAltLinkName: "comments",
        authorAltLink: "https://imgur.com/user/" + author,
        pageLink: "https://imgur.com/" + (data.in_gallery ? "gallery/" : "") + id,
        pageLinkText: "imgur " + (data.in_gallery ? "gallery" : "image") + " page",
        mediaTagHtml: mediaTagHtml,
        width: data.width,
        height: data.height,
        videoSize: data.mp4_size,
        imageSize: data.size,
        datetime: data.datetime * 1000,
        title: data.title,
        description: data.description,
        tags: data.topic || data.section,
        rating: data.nsfw ? "NSFW" : null
      });
      addExpando(entry, entry.find(".imageInfo"), false, false, null, null, "https://i.imgur.com/" + id + ".jpg", data.animated ? "https://i.imgur.com/" + id + ".mp4" : null);
    }
  }

  function gfyFetch()
  {
    var button = $(this);
    var entry = button.parents(".entry");
    var link = entry.find("a.title");
    button.text("fetching...");
    $.ajax({
      url: "https://upload.gfycat.com/transcodeRelease?fetchUrl=" + encodeURIComponent(link.attr("href")),
      success: function(data, textStatus, request) {
        var response = JSON.parse(request.responseText);
        if (response.gfyname)
        {
          var gfyUrl = "https://gfycat.com/" + response.gfyName;
          button.text("viewing gfy link").attr("title", "click to view original link");
          link.attr("data-prev-href", link.attr("href")).attr("data-gfy-href", gfyUrl).attr("href", gfyUrl);
          button.off("click").click(function() {
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
          addExpando(entry, button, false, false, null, null, null, response.mp4Url);
        }
        else
          button.text(response.isOk ? "gfy request started" : response.error);
      },
      error: function(request, textStatus, errorThrown) {
        console.log("reddit image info error: " + errorThrown);
      }
    });
  }

  function showGfyInfo(link, gfyItem)
  {
    var entry = link.parents(".entry");
    var href = link.attr("href");
    var minDuration = (gfyItem.numFrames / (+gfyItem.frameRate + 1)).toFixed(2);
    var maxDuration = (gfyItem.numFrames / gfyItem.frameRate).toFixed(2);
    var isVideoLink = /.com\/\w+(\.(mp4|webm))?(#.*)?$/i.test(href);
    var mediaTagHtml = "";
   if (settings.highlightThumbnailVersion && /.com\/\w+\-[\w_]+(\.\w+)?(#.*)?$/i.test(href))
      mediaTagHtml += "<span class=\"imageInfoButton\" style=\"background-color: #" + settings.thumbnailVersionColor + "; color: #" + settings.thumbnailVersionTextColor + ";\" title=\"link to a smaller size-restricted version of this gfy, or to a static thumbnail\">small/thumb version</span>";
    showMediaInfo(link, {
      mediaName: "gfycat",
      isVideoLink: true,
      authorName: gfyItem.userName,
      authorLink: "https://gfycat.com/@" + gfyItem.userName,
      pageLink: "https://gfycat.com/" + gfyItem.gfyName,
      pageLinkText: "gfy page",
      mediaTagHtml: mediaTagHtml,
      source: gfyItem.url,
      minDuration: minDuration,
      maxDuration: maxDuration,
      frameRate: gfyItem.frameRate,
      frames: gfyItem.numFrames,
      width: gfyItem.width,
      height: gfyItem.height,
      videoSize: gfyItem.mp4Size,
      imageSize: gfyItem.gifSize,
      datetime: gfyItem.createDate * 1000,
      title: gfyItem.title,
      tags: gfyItem.tags ? gfyItem.tags.join() : null
    });
    addExpando(entry, entry.find(".imageInfo"), false, false, null, null, null, gfyItem.mp4Url);
  }

  function showGiphyInfo(link, giphyItem)
  {
    var entry = link.parents(".entry");
    var img = giphyItem.images.original;
    showMediaInfo(link, {
      mediaName: "giphy",
      authorName: giphyItem.userName,
      authorLink: giphyItem.user ? giphyItem.user.profile_url : null,
      authorAltLinkName: giphyItem.user && giphyItem.user.display_name || giphyItem.userName,
      authorAltLink: giphyItem.user && giphyItem.user.twitter ? "https://twitter.com/" + giphyItem.user.twitter.replace("@", "") : null,
      pageLink: giphyItem.url,
      pageLinkText: "giphy page",
      source: giphyItem.source,
      frames: img.frames,
      width: img.width,
      height: img.height,
      videoSize: img.mp4_size,
      imageSize: img.size,
      datetime: Date.parse(giphyItem.import_datetime + "+00:00"),
      rating: giphyItem.rating.toUpperCase()
    });
    addExpando(entry, entry.find(".imageInfo"), false, false, null, null, img.url, img.mp4);
  }

  function showGifsDotComInfo(link, gifytItem, gifId)
  {
    var entry = link.parents(".entry");
    showMediaInfo(link, {
      mediaName: "gifs.com",
      pageLink: "https://gifs.com/gif/" + gifId,
      pageLinkText: "gifs.com page",
      source: gifytItem.sauce,
    });
    addExpando(entry, entry.find(".imageInfo"), false, false, null, null, null, gifytItem.mp4Url);
  }

  function showSlimgInfo(link, slimgItem)
  {
    var entry = link.parents(".entry");
    var href = link.attr("href");
    if (slimgItem.album_key)
    {
      showMediaInfo(link, {
        mediaName: "slimg",
        authorName: slimgItem.username,
        pageLink: slimgItem.url,
        pageLinkText: "slimg album page",
        datetime: slimgItem.created * 1000,
        title: slimgItem.description
      });
      addExpando(entry, entry.find(".imageInfo"), true, false, null, slimgItem);
    }
    else
    {
      if (settings.highlightAnimated && slimgItem.animated)
        highlightLink(link, linkColor(href));
      showMediaInfo(link, {
        mediaName: "slimg",
        authorName: slimgItem.username,
        pageLink: slimgItem.url,
        pageLinkText: "slimg image page",
        width: slimgItem.width,
        height: slimgItem.height,
        imageSize: slimgItem.size,
        datetime: slimgItem.created * 1000,
        title: slimgItem.description
      });
      addExpando(entry, entry.find(".imageInfo"), false, false, null, null, slimgItem.url_direct, slimgItem.animated ? slimgItem.url_mp4 : null);
    }
  }

  function addRetryButton(link, entry, request, error)
  {
    entry.find(".imageInfoRetry").remove();
    var resp = request.responseText ? JSON.parse(request.responseText) : null;
    if (error == "Daily client requests exceeded")
      showNotification("API rate limit exceeded. You may need to set a new or different API client ID in the reddit image info options.");
    $("<a class=\"imageInfoRetry imageInfoButton imageInfoGreyButton imageInfoLink\" title=\"click to retry\">" + (resp && resp.data && resp.data.error || error) + "</a>").insertAfter(link.parents(".title"));
    entry.find(".imageInfoRetry").click(function() {
      $(this).text("Retrying...");
      $(this).parents(".entry").find("a.title").each(function() {
        checkLink($(this));
      });
    });
  }

  var imgurIdRegex = /imgur\.com\/+(gallery\/|a\/|(?:t(?:opic)?|r)\/[\w]+\/)?([\d\w]{5,7})(s|b|t|m|l|h)?(?=[^\d\w]|$)/i;

  function checkLink(link)
  {
    try
    {
      var href = link.attr("href");
      var entry = link.parents(".entry");
      var cachedData;
      var mediaTag;
      var match = href.match(/gfycat\.com\/(\w+)/i);
      if (match)
      {
        mediaTag = match[1];
        cachedData = getCachedData(mediaTag, null);
        if (cachedData)
          showGfyInfo(link, cachedData, mediaTag);
        else
          $.ajax({
            url: "https://gfycat.com/cajax/get/" + mediaTag,
            success: function(data, textStatus, request) {
              var gfyData = JSON.parse(request.responseText);
              if (gfyData.error)
                $("<span class=\"imageInfoButton imageInfoGreyButton\">" + gfyData.error + "</span>").insertAfter(link.parents(".title"));
              else
              {
                showGfyInfo(link, gfyData.gfyItem);
                cacheData(mediaTag, gfyData.gfyItem, settings.gfycatPostCacheTime);
              }
            },
            error: function(request, textStatus, error) {
              console.log(error);
              addRetryButton(link, entry, request, error);
            }
          });
        if (settings.highlightAnimated)
          highlightLink(link, /gfycat\.com\/\w+((\?|#).+)?$/i.test(href) ? settings.gfyColor : linkColor(href));
      }
      else
      {
        match = href.match(/(?:giphy\.com|gph\.is)\/(?:gifs\/|media\/)?(?:\w+\-)*(\w{12,20})/i);
        if (match)
        {
          mediaTag = match[1];
          cachedData = getCachedData(mediaTag, null);
          if (cachedData)
            showGiphyInfo(link, cachedData, mediaTag);
          else
            $.ajax({
              url: "https://api.giphy.com/v1/gifs/" + mediaTag + "?api_key=dc6zaTOxFJmzC",
              success: function(data, textStatus, request) {
                var giphyData = JSON.parse(request.responseText).data;
                showGiphyInfo(link, giphyData);
                cacheData(mediaTag, giphyData, settings.otherCacheTime);
              }
            });
          if (settings.highlightAnimated)
            highlightLink(link, linkColor(href));
        }
        else
        {
          match = href.match(/\/\/(?:j\.)?gif(?:youtube|s)\.com\/(?:(?:gif|embed)\/(?:\w+\-)*)?(\w+)/i);
          if (match)
          {
            mediaTag = match[1];
            cachedData = getCachedData(mediaTag, null);
            if (cachedData)
              showGifsDotComInfo(link, cachedData, mediaTag);
            else
              $.ajax({
                url: "https://gifs.com/api/" + mediaTag,
                success: function(data, textStatus, request) {
                  var gifytData = JSON.parse(request.responseText);
                  showGifsDotComInfo(link, gifytData, mediaTag);
                  cacheData(mediaTag, gifytData, settings.otherCacheTime);
                }
              });
            if (settings.highlightAnimated)
              highlightLink(link, linkColor(href));
          }
          else
          {
            match = href.match(/\/\/(?:i\.)?sli\.mg\/(a\/)?([\d\w]{6})(\.ss|\.ms)?(?=[^\d\w]|$)/i);
            if (match)
            {
              mediaTag = match[2];
              cachedData = getCachedData(mediaTag, null);
              if (cachedData)
                showSlimgInfo(link, cachedData);
              else
              {
                if (!settings.slimgClientId)
                  showNotification("Slimg client ID required. Set one in the reddit image info options.");
                else
                  $.ajax({
                    url: "https://api.sli.mg/" + (match[1] == "a/" ? "album/" : "media/") + mediaTag,
                    headers: {"Authorization": "Client-ID " + settings.slimgClientId},
                    success: function(data, textStatus, request) {
                      var slimgData = JSON.parse(request.responseText).data;
                      showSlimgInfo(link, slimgData);
                      cacheData(mediaTag, slimgData, settings.slimgPostCacheTime);
                    },
                    error: function(request, textStatus, error) {
                      console.log(error);
                      addRetryButton(link, entry, request, error);
                    }
                  });
              }
            }
            else
            {
              match = href.match(imgurIdRegex);
              if (match)
              {
                mediaTag = match[2];
                cachedData = getCachedData(mediaTag, null);
                if (cachedData)
                  showImgurInfo(link, match, cachedData);
                else
                {
                  if (!settings.imgurClientId)
                    showNotification("Imgur client ID required. Set one in the reddit image info options.");
                  else
                    $.ajax({
                      url: "https://api.imgur.com/3/" + (match[1] == "a/" || (mediaTag.length < 7 && !/\.com\/.+\./i.test(href)) ? "album" : "image") + "/" + mediaTag,
                      headers: {"Authorization": "Client-ID " + settings.imgurClientId},
                      success: function(data, textStatus, request) {
                        var imgurData = JSON.parse(request.responseText).data;
                        if (imgurData.in_gallery)
                        {
                          $.ajax({
                            url: "https://api.imgur.com/3/gallery/" + mediaTag,
                            headers: {"Authorization": "Client-ID " + settings.imgurClientId},
                            success: function(data, textStatus, request) {
                              imgurData = JSON.parse(request.responseText).data;
                              showImgurInfo(link, match, imgurData);
                              cacheData(mediaTag, imgurData, settings.imgurPostCacheTime);
                            },
                            error: function(request, textStatus, error) {
                              addRetryButton(link, entry, request, error);
                              showImgurInfo(link, match, imgurData);
                              cacheData(mediaTag, imgurData, settings.imgurPostCacheTime);
                            }
                          });
                        }
                        else
                        {
                          showImgurInfo(link, match, imgurData);
                          cacheData(mediaTag, imgurData, settings.imgurPostCacheTime);
                        }
                      },
                      error: function(request, textStatus, error) {
                        addRetryButton(link, entry, request, error);
                      }
                    });
                }
              }
              else
              {
                match = href.match(/(i\.reddituploads\.com|\.(webm|mp4|ogg|jpe?g|png|gif)((\?|#).+)?$)/i);
                if (match)
                {
                  var infoContent = "<span class=\"imageInfo\"></span>";
                  console.log(match);
                  $(infoContent).insertAfter(link.parents(".title"));
                  addExpando(entry, entry.find(".imageInfo"), false, false, null, null, href, href.match(/\.(webm|mp4|ogg)((\?|#).+)?$/i) ? href : null);
                  if (settings.highlightAnimated && href.match(/\.(gif|webm|mp4|ogg)((\?|#).+)?$/i))
                    highlightLink(link, linkColor(href));
                }
              }
              // else if (href.match(/\.gif$/i))
              // {
                // // TODO: Fetch image and load info
                // highlightLink(link, linkColor(href));
                // $("<a class=\"imageInfoGfyLink imageInfoButton imageInfoLink\" style=\"margin-right: 5px;\">fetch gfy</a>").insertAfter(link.parents(".title"));
                // entry.find(".imageInfoGfyLink").click(gfyFetch);
              // }
            }
          }
        }
      }
      if (isCommentPage)
        currentMediaTag = mediaTag;
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
    if (title.hasClass("durationadded"))
      return;
    var vid = $(button).parent().find("video");
    var duration = vid.prop("duration");
    if (vid.length > 0 && !isNaN(duration))
    {
      var durationHtml = "[" + duration.toFixed(2) + "]";
      if (settings.highlightLongDuration && (duration >= settings.gradientDurationMin || duration >= settings.longDuration))
        durationHtml = "<div style=\"display: inline; background-color: #" + durationColor(duration) + "\">" + durationHtml + "</div>";
      title.html(durationHtml + " " + title.html()).addClass("durationadded");
    }
    else
      window.setTimeout(addDuration, 200, button);
  }

  // Add image info on page load
  $(".entry a.title").each(function(index) {
    window.setTimeout(checkLink, 10 * index, $(this));
  });

  // Add video duration info, hooked to RES inline expandos
  window.setTimeout(function() {
    $("a.toggleImage").click(function() {
      window.setTimeout(function(button) {
        addDuration(button);
      }, 300, this);
    });
    $("#viewImagesButton").click(function() {
      window.setTimeout(function() {
        $(".expando-button.expanded").each(function(index) {
          window.setTimeout(function(button) {
            button.click();
            button.click();
          }, 100 * index, this);
        });
      }, 500);
    });
  }, 2500);

  function checkComment(comment, imgurComments, depth)
  {
    var commentReposts = 0;
    var commentText = comment.text().trim();
    var commentTextStripped = commentText.replace(/[^\w ]/g, "");
    if (commentTextStripped.length > settings.minimumCommentLength && commentText != "[deleted]")
    {
      for (var i = 0; i < imgurComments.length; i++)
      {
        var imgurComment = imgurComments[i].comment.replace(/ +/g, " ").trim();
        var imgurCommentStripped = imgurComment.replace(/[^\w ]/g, "");
        if (commentTextStripped == imgurCommentStripped || commentTextStripped == imgurCommentStripped.replace(/imgur/g, "reddit"))
        {
          var diff = new Date(comment.parents(".entry").find("time").attr("datetime")).getTime() - imgurComments[i].datetime * 1000;
          if (diff > 0)
          {
            var id = "imageInfoCommentReport_" + comment.parent().attr("id");
            var imgurUrl = "https://imgur.com/gallery/" + imgurComments[i].image_id + "/comment/" + imgurComments[i].id + (depth > 0 ? "/" + depth : "");
            $("<a class=\"imageInfoCommentRepost imageInfoButton imageInfoGreyButton\" href=\"" + imgurUrl + "\" title=\"T" + dateDiff(diff) + "\">imgur comment repost (" + (commentText == imgurComment ? "exact" : "fuzzy") + ") </a><a id=\"" + id + "\" class=\"imageInfoCommentReport imageInfoButton imageInfoRedButton imageInfoLink\">Report</a>").insertAfter(comment);
            $("#" + id).click(function() {
              var entry = $(this).parents(".entry");
              var reportButton = entry.find("a.reportbtn");
              if (reportButton.length > 0)
              {
                reportButton[0].click();
                window.setTimeout(function() {
                  entry.find("input[value=other]").click();
                  entry.find("input[name=other_reason]").val(settings.reportReasonText + imgurUrl);
                  if (!settings.allowEditingOfReportReason)
                    entry.find(".submit-action-thing").click();
                }, 100);
              }
              else
                showNotification("Unable to report, no report button.");
            });
            commentReposts++;
          }
        }
        if (!settings.checkTopLevelCommentsOnly)
          commentReposts += checkComment(comment, imgurComments[i].children, depth + 1);
      }
    }
    return commentReposts;
  }

  function checkAllComments(imgurComments, mediaTag)
  {
    $(".imgurCommentCheck").remove();
    $("div.menuarea").append($("<a class=\"imgurCommentCheck imageInfoGreyButton imageInfoButton imageInfoLink\">checking for imgur comment reposts...</a>"));
    var commentReposts = 0;
    $(".entry .usertext-body").each(function() {
      commentReposts += checkComment($(this), imgurComments, 0);
    });
    $(".imgurCommentCheck").remove();
    $("div.menuarea").append($("<a class=\"imgurCommentCheckResults imageInfoButton" + (commentReposts > 0 ? " imageInfoRedButton" : " imageInfoGreyButton") + " imageInfoLink\" title=\"Click to recheck\">imgur comment reposts: " + commentReposts + "</a>"));
    $(".imgurCommentCheckResults").click(function() {
      $(".imgurCommentCheckResults").remove();
      $(".imageInfoCommentRepost").remove();
      $(".imageInfoCommentReport").remove();
      var cachedData = getCachedData(mediaTag + "-c", null);
      if (cachedData)
        checkAllComments(cachedData, mediaTag);
      else
        loadComments(mediaTag);
    });
  }

  function loadComments(mediaTag)
  {
    if (!settings.imgurClientId)
      showNotification("Imgur client ID required. Set one in the reddit image info options.");
    else
    {
      $("div.menuarea").append($("<a class=\"imgurCommentCheck imageInfoButton imageInfoGreyButton imageInfoLink\">loading imgur comments...</a>"));
      $.ajax({
        url: "https://api.imgur.com/3/gallery/" + mediaTag + "/comments/",
        headers: {"Authorization": "Client-ID " + settings.imgurClientId},
        success: function(data, textStatus, request) {
          var imgurComments = JSON.parse(request.responseText).data;
          checkAllComments(imgurComments, mediaTag);
          cacheData(mediaTag + "-c", imgurComments, settings.imgurCommentsCacheTime);
          $(".imgurCommentCheck").remove();
        },
        error: function(request, textStatus, error) {
          $(".imgurCommentCheck").remove();
          $("div.menuarea").append($("<a class=\"imgurCommentCheckResults imageInfoButton imageInfoOrangeButton imageInfoLink\" title=\"Click to recheck\">" + (error == "Bad Request" ? "not in imgur gallery" : "error loading imgur comments: " + error) + "</a>"));
          $(".imgurCommentCheckResults").click(function() {
            $(".imgurCommentCheckResults").remove();
            $(".imageInfoCommentRepost").remove();
            var cachedData = getCachedData(mediaTag + "-c", null);
            if (cachedData)
              checkAllComments(cachedData, mediaTag);
            else
              loadComments(mediaTag);
          });
        }
      });
    }
  }

  if (settings.highlightImgurCommentReposts && isCommentPage)
  {
    var match = $(".entry a.title").attr("href").match(imgurIdRegex);
    if (match)
    {
      var mediaTag = match[2];
      cachedData = getCachedData(mediaTag + "-c", null);
      if (cachedData)
        checkAllComments(cachedData, mediaTag);
      else
      {
        if (settings.loadImgurCommentsAutomatically)
          window.setTimeout(function() {
            loadComments(mediaTag);
          }, 100);
        else
        {
          $("div.menuarea").append($("<a class=\"imgurCommentCheck imageInfoButton imageInfoGreyButton imageInfoLink\">check for imgur comment reposts</a>"));
          $(".imgurCommentCheck").click(function() {
            $(".imgurCommentCheck").remove();
            loadComments(mediaTag);
          });
        }
      }
    }
  }
}

window.setTimeout(main, 250);
