/* This is to serve index.html with few ajax call to pull data from server (Express router exercise)
 * Author: HartCode programmer
 */
"use strict";

$(function() {

    $("#leaguesBtn").on("click", function() {
        let leagues = 'leagues';
        getData(leagues);
    })

    // $("#teamsBtn").on("click", function() {
    //     let teams = 'teams';
    //     getData(teams);
    // })

    $("#loginBtn").on("click", function() {
        showLogin();
        // window.location.href = "/users/login";
        // let login = 'users/login';
        // getData(login);
    })

    $("#registerBtn").on("click", function() {
        window.location.href = "/users/register";
        // let register = 'users/register';
        // getData(register);
    })

});


/* function is to get league data from server and call loadLeague to dynamically populate the DOM 
 * @param: None
 * Calls: loadLeagues()
 * Called by: showLogin()
 */
function getLeagues() {
    let leagues;
    // Store the JSON data in javaScript objects (Pull leagues from server).  
    $.getJSON("http://localhost:3000/leagues/data", function(data) {
            leagues = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            // Store leagues in Session storage to access for generating league section
            sessionStorage.setItem("leaguesLocal", JSON.stringify(leagues));
            loadLeagues(leagues);
        })
        .fail(function() {
            // upon failure response, send message to user
            errorMsg = "Failure to get leagues list, please refresh the page"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });
}

/* function is to get league data from server and call loadLeague to dynamically populate the DOM 
 * @param: None
 * Calls: loadleagues()
 * Called by: getHomeSection()
 */
function showLogin() {
    $("#contentDiv").empty();
    $("#contentDiv")
        .attr("class", "container justified-content-center")
        // Home Section
        .append($("<section/>")
            .attr("class", "row")
            .attr("id", "loginSection")
            .append($("<div/>")
                .attr("id", "loginDiv")
                .append($("<form/>")
                    .attr("class", "form-login")
                    .attr("id", "form-login")
                    .append($("<img/>")
                        .attr("class", "mb-4")
                        .attr("id", "lock")
                        .attr("alt", "login")
                        .attr("src", "/../images/lock.png"))
                    .append($("<h1/>")
                        .attr("class", "h3 mb-3 font-weight-normal")
                        .html("Please Log in")))))
        // Input div to add form fields
    let inputDiv = getInputDiv("inputEmail", "Email Address", "Enter Email address", "email");
    $("#form-login").append(inputDiv);
    inputDiv = getInputDiv("inputPassword", "Password", "Enter Password", "password");
    $("#form-login").append(inputDiv);

    // Add buttons for login section
    $("#form-login").append($("<button/>")
            .attr("class", "btn btn-lg btn-primary btn-block")
            .attr("id", "submitBtn")
            .attr("type", "submit")
            .on("click", function(e) {
                e.preventDefault();
                postLoginForm();
            })
            .html("Log in"))
        .append($("<button/>")
            .attr("class", "btn btn-lg btn-primary btn-block")
            .attr("id", "cancelBtn")
            .attr("type", "button")
            .on("click", function(e) {
                e.preventDefault();
                showHome();
            })
            .html("Cancel"))
        .append($("<button/>")
            .attr("class", "btn btn-lg btn-primary btn-block hidden")
            .attr("id", "logoutBtn")
            .attr("type", "button")
            .html("Log out"))
}


function getInputDiv(name, text, placeHolder, inputType) {
    let inputDiv = $("<div>")
        .attr("class", "row offset-md-3 col-md-8 mt-1 form-inline")
        .append($("<label/>")
            .attr("class", "d-none d-md-inline col-md-3")
            .attr("for", name)
            .html(text))
        .append($("<input/>")
            .attr("class", "d-inline form-control col-md-6")
            .attr("name", name)
            .attr("id", name)
            .attr("placeholder", placeHolder)
            .attr("required", true)
            .attr("type", inputType))
    return inputDiv;
}


/* function is to post login form upon user input 
 * @param: None  
 * Calls: getleagueSection(), showLeagues()
 * Called by: showLogin() 
 */
function postLoginForm() {
    let data = {
        "email": $('#inputEmail').val(),
        "password": $('#inputPassword').val()
    };

    $.post("http://localhost:3000/users/login", data, function() {})
        .done(function(res) {
            console.log("success");
            getLeagues();
            // getleagueSection();
            // showLeagues();
            // $('#msg').removeClass('alert-danger');
            // $('#msg').addClass('alert-success');
            // $('#msg').html('Success!');

            // $('#inputEmail').val('');
            // $('#inputEmail').attr("disabled", true);
            // $('#inputPassword').val('');
            // $('#inputPassword').attr("disabled", true);

            // $('#lock').attr('src', 'img/unlock.png');

            // $('#submitBtn').hide();
            // $('#logoutBtn').show();
            // $('#logoutBtn').focus();
        })
        .fail(function(e) {
            console.log(e);
            if (e.status === 401) {
                $('#errorMsgId').html('Account locked!');
            } else if (e.status === 403) {
                $('#errorMsgId').html('Invalid Creds!');
            } else {
                $('#errorMsgId').html(`Error: ${e.status}`);
            }
            $('#errorMsgId').removeClass('alert-success');
            $('#errorMsgId').addClass('alert-danger');
            $('#inputEmail').focus();
        });
    $('#errorMsgId').show();
};


/* function is to get league Section for display  
 * @param: leagueCode (string) - league code indicating league option
 * Calls: loadleaguesForLeagueSection()
 * Called by: getRegTeam(), submitRegForm(), loadTeamDetails(), getDelTeam(), 
 * getDelTeam(), window onload, loadleagues()
 */
function getleagueSection(leagueCode) {
    let leaguesLocalStorage = JSON.parse(sessionStorage.getItem("leaguesLocal"));

    if (leaguesLocalStorage == "") {
        errorMsg = "Failure to get leagues list from local storage, please refresh the page"
        $("#errorMsgId").html(errorMsg);
        $("#errorMsgId").addClass("badInput");
    } else {
        if (leagueCode == undefined) {
            // Store the JSON data in javaScript objects (Pull leagues).  
            loadleaguesForLeagueSection(leagues, leagueCode);
        } else {
            // Selected particular league
            loadleaguesForLeagueSection(leagues, leagueCode);
        }
    }
}

/* function is to load leagues under league selection dropdown 
 * @param leagues (javastring object) - contains list of leagues 
 * @param leagueCode (string) - selected league code from home page
 * calls: getTeams(), getAddTeam()
 */
function loadleaguesForLeagueSection(leagues, leagueCode) {
    $("#contentDiv").empty();
    $("#footerDiv").addClass("fixed-bottom");
    $("#contentDiv").append($("<section>")
        .attr("id", "leagueSection")
        // User friendly message for league dropdown
        .append($("<h3/>")
            .html("Select the Leagues from the dropdown list:")
            .attr("class", "font-italic"))
        // League Dropdown Div and DDL
        .append($("<div>")
            .attr("class", "row")
            .append($("<label/>")
                .attr("class", "d-none d-md-inline")
                .attr("for", "selectLeagueList")
                .html("League Lists"))
            .append($("<select/>")
                .attr("id", "selectLeagueList")
                .attr("class", "d-none d-inline form-control col-md-3 ml-2")
                .on("change", function(e) {
                    // prevent all default action and do as we direct
                    e.preventDefault();
                    // Clear all prior error messages
                    $("#errorMsgId").empty();
                    // Remove the fixed bottom class, as data is loaded and it needs to be responsive now
                    $("#footerDiv").removeClass("fixed-bottom");
                    // clear the team table Div before populating data for respective option
                    $("#teamTableDiv").empty();
                    getTeams($("#selectLeagueList").val());
                    // Store in session storage for goback functionality from team details page
                    let leagueSelection = $("#selectLeagueList").val();
                    sessionStorage.setItem("leagueSelSession", leagueSelection);
                })
                //Add default option and view all option
                .append($("<option/>")
                    .val("")
                    .html("Select league from dropdown list"))
            ))
        // table to list the teams under selected league dropdown option
        .append($("<div/>")
            .append($("<div/>")
                .attr("id", "teamTableDiv")
                .attr("class", "col-auto ml-2")))
        // Add team button in league section
        .append($("<div/>")
            .attr("class", "col-md-2")
            .append($("<button/>")
                .attr("id", "regTeamBtn")
                .attr("class", "btn btn-info mt-2")
                .html("Register Team")
                .on("click", function(e) {
                    // prevent all default action and do as we direct
                    e.preventDefault();
                    // Clear the fixed bottom as register page will have data
                    $("#footerDiv").removeClass("fixed-bottom");
                    // Clear all prior error messages
                    $("#errorMsgId").empty();
                    // Usage of cache for retrieving JSON object (requires stringify and parse, as cache can have only string)
                    let leaguesLocalStorage = JSON.parse(sessionStorage.getItem("leaguesLocal"));
                    // Get Add team section template
                    getRegTeam(leaguesLocalStorage);
                })))
    );

    //Run through league and populate the dropdown
    $.each(leagues, function(key, value) {
        $("#selectLeagueList").append($("<option/>")
            .val(value.Code)
            .html(value.Name))
    });

    //Add viewAll option at the end after populating all dropdown
    $("#selectLeagueList").append($("<option/>")
        .val("all")
        .html("View All"));

    // Set selection dropdown to the selected league from home section, if chosen
    if (leagueCode != undefined) {
        $("#selectLeagueList").val(leagueCode);
        // Remove the footer to display at bottom always, as default selection is chosen from home section 
        $("#footerDiv").removeClass("fixed-bottom");
        getTeams(leagueCode);
    } else {
        $("#selectLeagueList").val("");
    }
}

// Get leagues
function getData(path) {
    $.getJSON(`http://localhost:3000/${path}`, function() {})
        .done(function(data) {
            // let parsedData = JSON.parse(data);
            console.log(data);
            switch (path) {
                case 'login':
                    break;
                case 'register':
                    break;
                case 'leagues':
                    let leagues = data;
                    loadLeagues(leagues);
                    break;
                default:
                    break;
            }

        })
        .fail(function() {
            console.log("error");
        })
}

function loadLeagues(leagues) {
    $("#contentDiv").empty();
    $("#contentDiv")
        .append($("<div/>")
            // .attr("class", "col-md-5")
            .attr("id", "leagueListDiv")
            .append($("<h3/>")
                .attr("class", "font-weight-bold font-italic")
                .html("List of Leagues"))
            .append($("<ul/>")
                .attr("id", "leagueListUl")
                .attr("class", "list-unstyled list-inline"))
        )
        //Run through league and populate the dropdown
    $.each(leagues, function(key, value) {
        $("#leagueListUl").append($("<li/>")
            .attr("class", "list-inline-item")
            .append($("<a/>")
                .attr("href", "#")
                .attr("class", "non-underline-link")
                .append($("<br/>"))
                .append($("<span/>")
                    .attr("class", "text-secondary text-center")
                    .text(value.Name))
                .on("click", function(e) {
                    // prevent all default action and do as we direct
                    e.preventDefault();
                    showLeagues();
                    getleagueSection(value.Code);
                    // Remove the fixed bottom class, as data is loaded and it needs to be responsive now
                    $("#footerDiv").removeClass("fixed-bottom");
                })));
    });

}