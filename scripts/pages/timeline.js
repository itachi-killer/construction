/*
 *
 * This file contains scripts for
 * making the timeline dynamic
 *
 */
var pTilesUL = $("#p-tiles");
/*
 *
 * Get JSON Data for the Timeline
 *
 */
var request = new XMLHttpRequest();
//request.open("GET", "assets/data/timeline.json", false);
request.open("GET", "https://www.shapoorjipallonji.com/timeline-ajax", false);
request.send(null);
// get the request response
// console.log(request.responseText);
var TIMELINE_PROJECTS_BY_YEAR = JSON.parse(request.responseText).timeline;
//var TIMELINE_PROJECTS_BY_YEAR = JSON.parse(request.responseText).projects;
// reverse it because we want the data to be in the descending order of year
TIMELINE_PROJECTS_BY_YEAR = _.reverse(TIMELINE_PROJECTS_BY_YEAR);
/*
 *
 * Set Timeline Layout for Mobile
 *
 */
if (getDeviceType() === "mobile") {
    var projectCardsContainer = $("#component__project-cards-container");
    var projectCardsContainerInnerHTML = "";
    _.map(TIMELINE_PROJECTS_BY_YEAR, function (project, index) {
        projectCardsContainerInnerHTML += '<div class="component__project-card">';
        projectCardsContainerInnerHTML += '<a href="project/' + project.ID + '">';
        projectCardsContainerInnerHTML += '<div class="project-image" title="' + project.NAME + ", " + project.BUSINESS + '" aria-label="' + project.NAME + ", " + project.BUSINESS + '" data-image data-mobile-src="https://www.shapoorjipallonji.com/' + project.MOBILE_IMAGE + '"></div>"';
        if (project.LOCATION != "") {
            projectCardsContainerInnerHTML += '<div class="project-details"><p class="project-name">' + project.NAME + '</p><p class="project-location">' + project.LOCATION + ", " + project.YEAR + '</p></div>"';
        } else {
            projectCardsContainerInnerHTML += '<div class="project-details"><p class="project-name">' + project.NAME + '</p><p class="project-location">' + project.YEAR + '</p></div>"';
        }
        projectCardsContainerInnerHTML += "</a>";
        projectCardsContainerInnerHTML += "</div>";
    });
    projectCardsContainer.innerHTML = projectCardsContainerInnerHTML;
}
// set a project index for every project
_.map(TIMELINE_PROJECTS_BY_YEAR, function (project, index) {
    project["PROJECT_INDEX"] = index;
});
/*
 *
 * Year Data
 *
 */
/*
 * Function to create project list element
 */
function createProjectLI(columnIndex) {
    var LI = document.createElement("LI");
    LI.setAttribute("id", "p-col" + columnIndex);
    return LI;
}
/*
 * Function to create project tile
 */
function createProjectTile(project) {
    var pTile = document.createElement("div");
    pTile.classList.add("p-tile");
    pTile.id = "p-" + project.PROJECT_INDEX;
    return pTile;
}
/*
 * Function to create project image
 */
function createProjectImage(project) {
    var img = '<a href="project/' + project.ID + '"><img alt="' + project.NAME + ", " + project.BUSINESS + '" src="assets/pngs/empty.png" data-image data-desktop-src="https://www.shapoorjipallonji.com' + project.DESKTOP_IMAGE + '" class="p-tile-image" data-name="' + project.NAME + '"/></a>';
    return img;
}
/*
 * Function to create year label
 */
function createYearLabel(year, sameYearCount) {
    var label = document.createElement("div");
    label.classList.add("timeline-year-label");
    if (sameYearCount <= 1) {
        label.innerHTML = year;
    }
    if (sameYearCount > 1) {
        label.style.width = (Object.keys(sameYearCount).length * window.innerWidth) / 24 + "px";
        label.dataset.colSpan = Object.keys(sameYearCount).length;
    }
    return label;
}
/*
 * Add projects to HTML
 */
var GROUP_BY_YEAR_COLUMNS = _.groupBy(TIMELINE_PROJECTS_BY_YEAR, function (project) {
    return project.YEAR_COLUMN;
});
let PreviousYear = "";
let sameYearCount = 1;

_.map(GROUP_BY_YEAR_COLUMNS, function (column, columnIndex) {
    var LI = createProjectLI(parseInt(columnIndex) - 1);
    pTilesUL.appendChild(LI);

    if (PreviousYear != column[0].YEAR) {
        sameYearCount = 1;
    } else {
        sameYearCount++;
    }
    var label = createYearLabel(column[0].YEAR, sameYearCount);
    LI.appendChild(label);

    PreviousYear = column[0].YEAR;
    //
    _.map(column, function (project) {
        var pTile = createProjectTile(project);
        LI.prepend(pTile);
        //
        pTile.innerHTML = createProjectImage(project);
    });
});
// Set UL width
setPTilesULWidth();
console.log(($$("li", pTilesUL).length * window.innerWidth) / 24);

function setPTilesULWidth() {
    pTilesUL.style.width = (($$("li", pTilesUL).length + 1) * window.innerWidth) / 24 + "px";
}
/*
 *
 * Function for project mapping
 *
 */
function getProjectMapping(columnGroups) {
    var projectMapping = _.map(columnGroups, function (column, columnIndex) {
        var columnID = "p-col" + columnIndex;
        var projectIDs = _.map(column, function (project, index) {
            return "p-" + project.PROJECT_INDEX;
        });
        return {
            columnIndex: columnIndex,
            projectIDs: projectIDs,
            columnID: columnID,
        };
    });
    return projectMapping;
}
/*
 *
 * Business Data
 *
 */
// ORDER BY BUSINESS COLUMNS
var ORDER_BY_BUSINESS_COLUMN = _.orderBy(TIMELINE_PROJECTS_BY_YEAR, ["BUSINESS_COLUMN"], ["asc"]);
var GROUP_BY_BUSINESS = _.groupBy(ORDER_BY_BUSINESS_COLUMN, function (project) {
    return project.BUSINESS;
});
var lastCol = 0;
var TIMELINE_BUSINESS_DATA = [];

_.map(GROUP_BY_BUSINESS, function (businessGroup, businessName) {
    //
    //start index of new business group - ideally, start index should be lastCol + 1
    var businessFirstColumn = parseInt(businessGroup[0].BUSINESS_COLUMN);
    //order by business columns - 1 2 3 4 5 6
    var businessColumns = _.groupBy(businessGroup, function (project) {
        return project.BUSINESS_COLUMN;
    });

    //
    var temp_lastCol = 0;
    //
    _.map(businessColumns, function (column) {
        _.map(column, function (project) {
            var projectBusinessColumn = parseInt(project.BUSINESS_COLUMN);
            temp_lastCol = project.BUSINESS_COLUMN = projectBusinessColumn - businessFirstColumn + lastCol;
            TIMELINE_BUSINESS_DATA.push(project);
        });
    });
    lastCol = parseInt(temp_lastCol) + 1;
    //
    addBusinessLabel(businessColumns, businessName);
});

_.map(GROUP_BY_COMPANY, function (group, companyName) {
    //start index of new business group - ideally, start index should be lastCol + 1
    var companyFirstColumn = parseInt(group[0].COMPANY_COLUMN);
    //order by business columns - 1 2 3 4 5 6
    var companyColumns = _.groupBy(group, function (project) {
        return project.COMPANY_COLUMN;
    });
    //
    var temp_lastCol = 0;
    //
    _.map(companyColumns, function (column, companyColumn) {
        _.map(column, function (project) {
            var projectCompanyColumn = parseInt(project.COMPANY_COLUMN);
            temp_lastCol = project.COMPANY_COLUMN = projectCompanyColumn - companyFirstColumn + lastCol;
            TIMELINE_COMPANIES_DATA.push(project);
        });
    });
    lastCol = parseInt(temp_lastCol) + 1;
    //
    addCompanyLabel(companyColumns, companyName);
});

// Function to add business labels
function addBusinessLabel(businessColumns, businessName) {
    var timelineBusinessLabels = $("#timeline-business-labels");
    var label = document.createElement("div");
    label.classList.add("timeline-business-label");
    timelineBusinessLabels.appendChild(label);
    label.innerHTML = businessName;
    label.style.width = (Object.keys(businessColumns).length * window.innerWidth) / 24 + "px";
    label.dataset.colSpan = Object.keys(businessColumns).length;
}
/*
 *
 * Business Column Mapping
 *
 */
var GROUP_BY_BUSINESS_COLUMNS = _.groupBy(TIMELINE_BUSINESS_DATA, function (project) {
    return project.BUSINESS_COLUMN;
});
// console.log(GROUP_BY_BUSINESS_COLUMNS);
var BUSINESS_PROJECTS_MAPPING = getProjectMapping(GROUP_BY_BUSINESS_COLUMNS);
var lastColumnIndex = parseInt(BUSINESS_PROJECTS_MAPPING[BUSINESS_PROJECTS_MAPPING.length - 1].columnIndex);
var N_BUSINESS_COLUMNS = lastColumnIndex + 1;
/*
 *
 * Company Data
 *
 */
var GROUP_BY_COMPANY_COLUMNS = _.groupBy(TIMELINE_PROJECTS_BY_YEAR, function (project) {
    return project.COMPANY_COLUMN;
});
var ORDER_BY_COMPANY_COLUMN = _.orderBy(TIMELINE_PROJECTS_BY_YEAR, ["COMPANY_COLUMN"], ["asc"]);
var GROUP_BY_COMPANY = _.groupBy(ORDER_BY_COMPANY_COLUMN, function (project) {
    return project.COMPANY;
});
var lastCol = 0;
var TIMELINE_COMPANIES_DATA = [];
_.map(GROUP_BY_COMPANY, function (group, companyName) {
    //start index of new business group - ideally, start index should be lastCol + 1
    var companyFirstColumn = parseInt(group[0].COMPANY_COLUMN);
    //order by business columns - 1 2 3 4 5 6
    var companyColumns = _.groupBy(group, function (project) {
        return project.COMPANY_COLUMN;
    });
    //
    var temp_lastCol = 0;
    //
    _.map(companyColumns, function (column, companyColumn) {
        _.map(column, function (project) {
            var projectCompanyColumn = parseInt(project.COMPANY_COLUMN);
            temp_lastCol = project.COMPANY_COLUMN = projectCompanyColumn - companyFirstColumn + lastCol;
            TIMELINE_COMPANIES_DATA.push(project);
        });
    });
    lastCol = parseInt(temp_lastCol) + 1;
    //
    addCompanyLabel(companyColumns, companyName);
});
// Function to add business labels
function addCompanyLabel(companyColumns, companyName) {
    var timelineCompanyLabels = $("#timeline-company-labels");
    var label = document.createElement("div");
    label.classList.add("timeline-company-label");
    timelineCompanyLabels.appendChild(label);
    label.innerHTML = companyName;
    label.style.width = (Object.keys(companyColumns).length * window.innerWidth) / 24 + "px";
    label.dataset.colSpan = Object.keys(companyColumns).length;
}
/*
 *
 * Company Column Mapping
 *
 */
var GROUP_BY_COMPANY_COLUMNS = _.groupBy(TIMELINE_COMPANIES_DATA, function (project) {
    return project.COMPANY_COLUMN;
});

var COMPANY_PROJECTS_MAPPING = getProjectMapping(GROUP_BY_COMPANY_COLUMNS);
var lastColumnIndex = parseInt(COMPANY_PROJECTS_MAPPING[COMPANY_PROJECTS_MAPPING.length - 1].columnIndex);
var N_COMPANY_COLUMNS = lastColumnIndex + 1;
//
(function (window, document) {
    new JSImageLoader();
})(window, document);
//
// ===
var tooltipTextEl = $("#timeline-tooltip-text");
var tooltipEl = $("#timeline-tooltip");
var timelineContainerEl = $("#timeline-container");
var pTileLI = $$("li", pTilesUL);
var pTileList = $$(".p-tile", pTilesUL);
var pTileImageList = $$(".p-tile-image", pTilesUL);
//set tooltip event listener for all tiles
_.map(pTileImageList, function (pTileImage) {
    pTileImage.addEventListener("mouseover", function (event) {
        var self = this;
        TweenMax.set(tooltipEl, {
            opacity: 0,
            y: 10,
            force3D: true,
            onComplete: function () {
                tooltipTextEl.innerHTML = self.dataset.name;
                var leftOffset = (tooltipEl.getBoundingClientRect().width - self.getBoundingClientRect().width) / 2;
                var topOffset = self.getBoundingClientRect().top + window.pageYOffset - 80 - 52;
                var tx = self.getBoundingClientRect().left + timelineContainerEl.scrollLeft - leftOffset;
                tooltipEl.style.top = topOffset + "px";
                var tl = new TimelineMax();
                tl.set(tooltipEl, {
                    x: tx,
                }).to(tooltipEl, 0.15, {
                    opacity: 1,
                    y: 0,
                    force3D: true,
                });
            },
        });
    });
});
//
//animate project tiles
var animateProjectBlock = function (column) {
    var bx = parseFloat($("#" + column).offsetLeft).toFixed(2);
    var p0Offset = document.getElementById("p-0").offsetTop;
    var colWidth = Math.ceil(window.innerWidth / 24);
    return function (projectIDs) {
        // console.log(projectIDs);
        // console.log(projectIDs);
        _.map(projectIDs, function (projectID, index) {
            var project = $("#" + projectID);
            var init_x = project.offsetLeft;
            var init_y = project.offsetTop;
            var by = parseFloat(p0Offset - colWidth * index).toFixed(2);
            var move_x = bx - init_x + "px";
            var move_y = by - init_y + "px";
            project.style.transform = "translate3d(" + move_x + "," + move_y + ",0)";
            project.style.transition = "transform 500ms";
        });
    };
};
//shuffle
var shuffle = function (projColSpan, columnMapping, callback) {
    return function () {
        //scroll to left
        timelineContainerEl.scrollLeft = "0";
        //
        var wWindow = window.innerWidth;
        var wProjects = projColSpan * Math.ceil(wWindow / 24);
        // pTilesUL.style.transform = "translate3d(" + (wWindow - wProjects) / 2 + "px,0,0)";
        // pTilesUL.style.transition = "transform 500ms";
        console.log("columnMapping", wProjects);
        pTilesUL.style.width = (projColSpan * wWindow) / 24 + "px";
        // pTilesUL.style.width = wProjects + "px";

        // setTimeout(() => {
        columnMapping.forEach(function (item, index) {
            animateProjectBlock(item.columnID)(item.projectIDs);
        });
        // }, 1000);
        callback();
    };
};
/*
 * Function to shuffle projects by business
 */
var shuffleToBusiness = shuffle(N_BUSINESS_COLUMNS, BUSINESS_PROJECTS_MAPPING, function () {
    //set Active Tab
    setTimelineActiveTab("BUSINESS");
    scrollAmount = window.innerWidth / 2;
});
/*
 * Function to shuffle projects by company
 */
var shuffleToCompany = shuffle(N_COMPANY_COLUMNS, COMPANY_PROJECTS_MAPPING, function () {
    //set Active Tab
    scrollAmount = window.innerWidth / 2;

    setTimelineActiveTab("COMPANY");
});
/*
 * Function to shuffle projects by year
 */
function shuffleToYear() {
    setPTilesULWidth();
    //set Active Tab
    setTimelineActiveTab("YEAR");
    //return tiles container to its default position
    pTilesUL.style.transform = "translate3d(0,0,0)";
    pTilesUL.style.transition = "transform 500ms";
    //return project tiles to their default position
    _.map(pTileList, function (pTile) {
        pTile.style.transform = "translate3d(0,0,0)";
        pTile.style.transition = "transform 500ms";
    });
}
/*
 * Function to set active tab
 */
function setTimelineActiveTab(activeTab) {
    $("#main").dataset.activeTab = activeTab;
}
/*
 * Function to hide the tooltip
 */
function hideTooltip() {
    var tooltip = $("#timeline-tooltip");
    TweenMax.set(tooltip, {
        opacity: 0,
        y: 10,
        force3D: true,
    });
}
/*
 * Shuffle On Window Resize
 */
(function (window, document) {
    var resizeTimer = false;

    function onResize() {
        window.clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            var activeTab = $("#main").dataset.activeTab;
            switch (activeTab) {
                case "YEAR":
                    shuffleToYear();
                    break;
                case "BUSINESS":
                    shuffleToBusiness();
                    break;
                case "COMPANY":
                    shuffleToCompany();
                    break;
            }
            //adjust label widths
            _.map($$(".timeline-company-label"), function (label) {
                label.style.width = (label.dataset.colSpan * window.innerWidth) / 24 + "px";
            });
            _.map($$(".timeline-business-label"), function (label) {
                label.style.width = (label.dataset.colSpan * window.innerWidth) / 24 + "px";
            });
        }, 400);
    }
    window.addEventListener("resize", onResize, false);
})(window, document);
/*
 * Scroll functions
 */
let scrollAmount = windowWidth / 2;
function scrollToRight() {
    var left = windowWidth / 2;

    // var left = pTilesUL.offsetWidth + windowWidth / 24 - windowWidth;
    scrollHorizontally(timelineContainerEl, scrollAmount, 300);
    if (scrollAmount < pTilesUL.offsetWidth) {
        scrollAmount += left;
    } else {
        scrollAmount = windowWidth / 2;
    }
}

function scrollToLeft() {
    scrollAmount = windowWidth / 2;
    scrollHorizontally(timelineContainerEl, 0, 300);
}
