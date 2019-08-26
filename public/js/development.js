/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/development.js":
/*!*************************************!*\
  !*** ./resources/js/development.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function makeAppendFolderButton() {
  var $appendFolderButton = $("<button>フォルダを追加</button>", {
    type: "button"
  });
  $appendFolderButton.addClass("btn btn-primary");
  return $appendFolderButton;
}

function makeContextMenu() {
  return $("<div></div>", {
    "class": "btn-group-vertical",
    role: "group",
    "aria-label": "フォルダーコンテキストボタングループ",
    width: 200,
    css: {
      display: "none",
      border: "1px solid black",
      position: "fixed"
    }
  });
}

function displayContextMenu(e, contextMenu) {
  $("body").append(contextMenu);
  contextMenu.css("left", e.pageX + "px");
  contextMenu.css("top", e.pageY + "px");
  contextMenu.css("display", "block");
}

function makeFolder(parentFolderId) {
  var $folder = $("<div></div>");
  var $folderName = $("<p></p>");
  var $folderItems = $("<ul></ul>");
  $folder.append($folderName);
  $folder.append($folderItems);
  $folder.addClass("folder");
  var folderId;
  $.ajax({
    headers: {
      "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
    },
    url: "/folders/select",
    type: "GET",
    data: {
      "parent_folder_id": parentFolderId
    }
  }).done(function (selectedResponse) {
    var folderNameSuffix = 2;
    var folderNameText = "New Folder";

    if ($.isArray(selectedResponse)) {
      if (selectedResponse.find(function (folder) {
        return folder.name === folderNameText;
      }) !== undefined) {
        while (selectedResponse.find(function (folder) {
          return folder.name === folderNameText + folderNameSuffix;
        }) !== undefined) {
          ++folderNameSuffix;
        }

        folderNameText += folderNameSuffix;
      }
    } else {
      var isUniqueFolderName = function isUniqueFolderName(suffix) {
        var newFolderName = suffix === undefined ? folderNameText : folderNameText + suffix;

        for (var key in selectedResponse) {
          if (selectedResponse[key].name === newFolderName) {
            console.log(selectedResponse[key].name);
            return false;
          }
        }

        return true;
      };

      if (!isUniqueFolderName()) {
        while (!isUniqueFolderName(folderNameSuffix)) {
          ++folderNameSuffix;
        }

        folderNameText += folderNameSuffix;
      }
    }

    $folderName.text(folderNameText);
    var data = {
      'name': $folderName.text(),
      'lesson_id': $('meta[name="lesson-id"]').attr("content")
    };

    if (parentFolderId !== undefined) {
      data["parent_folder_id"] = parentFolderId;
    }

    $.ajax({
      headers: {
        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
      },
      url: '/folders',
      type: 'POST',
      data: data
    }).done(function (data) {
      folderId = data;
    });
  });
  $folderName.contextmenu(function (e) {
    var $contextMenu = makeContextMenu();
    var $appendFolderButton = makeAppendFolderButton();
    $contextMenu.append($appendFolderButton);
    $appendFolderButton.click(function () {
      var $newFolder = makeFolder(folderId);
      $folderItems.append($newFolder);
    });
    displayContextMenu(e, $contextMenu);
    $("body").click(function () {
      $contextMenu.css("display", "none");
    });
    return false;
  });
  return $folder;
}

$(function () {
  var $body = $("body");
  var $folderView = $("#folder-view");
  var $contextMenu = makeContextMenu();
  var $appendFolderButton = makeAppendFolderButton();
  $contextMenu.append($appendFolderButton);
  $appendFolderButton.click(function () {
    var $folder = makeFolder();
    $("#folder-view").append($folder);
  });
  $folderView.contextmenu(function (e) {
    displayContextMenu(e, $contextMenu);
    return false;
  });
  $body.click(function () {
    $contextMenu.css("display", "none");
  });
});

/***/ }),

/***/ 1:
/*!*******************************************!*\
  !*** multi ./resources/js/development.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Documents/AllCoder/AllCoderForDevelopers/resources/js/development.js */"./resources/js/development.js");


/***/ })

/******/ });