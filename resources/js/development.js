function makeAppendFolderButton() {
    const $appendFolderButton = $("<button>フォルダを追加</button>", {
        type: "button",
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
            position: "fixed",
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
    const $folder = $("<div></div>");
    const $folderName = $("<p></p>");
    const $folderItems = $("<ul></ul>");
    $folder.append($folderName);
    $folder.append($folderItems);
    $folder.addClass("folder");
    let folderId;
    $.ajax({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
        },
        url: "/folders/select",
        type: "GET",
        data: {
            "parent_folder_id": parentFolderId
        },
    }).done((selectedResponse) => {
        let folderNameSuffix = 2;
        let folderNameText = "New Folder";
        if ($.isArray(selectedResponse)) {
            if (selectedResponse.find(folder => folder.name === folderNameText) !== undefined) {
                while (selectedResponse.find(folder => folder.name === (folderNameText + folderNameSuffix)) !== undefined) {
                    ++folderNameSuffix;
                }
                folderNameText += folderNameSuffix;
            }
        } else {
            const isUniqueFolderName = function(suffix) {
                const newFolderName = suffix === undefined ? folderNameText : (folderNameText + suffix);
                for (let key in selectedResponse) {
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
        const data = {
            'name': $folderName.text(),
            'lesson_id': $('meta[name="lesson-id"]').attr("content"),
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
        }).done((data) => {
            folderId = data;
        });
    });
    $folderName.contextmenu(function (e) {
        const $contextMenu = makeContextMenu();
        const $appendFolderButton = makeAppendFolderButton();
        $contextMenu.append($appendFolderButton);
        $appendFolderButton.click(function () {
            const $newFolder = makeFolder(folderId);
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
    const $body = $("body");
    const $folderView = $("#folder-view");
    const $contextMenu = makeContextMenu();
    const $appendFolderButton = makeAppendFolderButton();
    $contextMenu.append($appendFolderButton);
    $appendFolderButton.click(function () {
        const $folder = makeFolder();
        $("#folder-view").append($folder);
    });
    $folderView.contextmenu(function(e) {
        displayContextMenu(e, $contextMenu);
        return false;
    });
    $body.click(function() {
        $contextMenu.css("display", "none");
    });
});