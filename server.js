/**
 * Created by kaya on 4/24/2017.
 */
var express = require('express');
app = express();
var port = 8000;
//load tweets data
var tweets_data = require( __dirname + '/favs.json');

//accept localhost:port/
app.get('/', function(req, res){
    //__dirname = difrectory name of current module
    res.sendFile(__dirname + '/twitterRest.html');
});

app.get('/get_detailed_tweets', function (req, res) {
   console.log("In the getting_detailed_tweets");
   console.log("Tweets Id "+req.query.tweets_id);
   var given_tweets_id  = req.query.tweets_id;
   //to do read files
    var index = 0;
    var result = "";
    while(tweets_data[index] != null)
    {
        if(tweets_data[index].id == given_tweets_id)
        {
            console.log("index " + index);
            //result = "text: " + tweets_data[index].text + "\n user :" + tweets_data[index].user.name;
            result = form_detailed_tweets(tweets_data[index]);
        }
        index++;
    }
    if(result == "")
    {
        //nothing inserted to result for all tweets
        result = "No Detailed Information is Available";
    }
   //get corresponding tweets
   res.end(result);
});

app.get('/get_detailed_user', function (req,res) {
    console.log("in the getting_detailed_user");
    console.log("Screen name " + req.query.screen_name);
    var given_screen_name = req.query.screen_name;
    var index = 0;
    var result = "";
    while(tweets_data[index] != null)
    {
        if(tweets_data[index].user.screen_name  == given_screen_name)
        {
            console.log("index " + index);
            //result = "text: " + tweets_data[index].text + "\n user :" + tweets_data[index].user.name;
            result = form_detailed_users(tweets_data[index]);
        }
        index++;
    }
    if(result == "")
    {
        result = "could not find corresponding user";
    }


    res.end(result);

});

app.get('/get_all_tweets', function (req, res) {
    //get all of tweets in terms of create time, id, and tweet text

    //prepare output in JSON format at
    console.log("in get all tweets");
    var result = form_all_tweets(tweets_data);
    if(result == null)
    {
        res.end("data is not available");
    }
    else
    {
        res.end(result);
    }

});
app.get('/get_all_known_users', function (req,res) {
    var result = "";
    result = form_all_known_users(tweets_data);
    if(result == "")
    {
        result = "Error: Could not retrieve OR not formed html ";
    }
    res.end(result);
});
app.get('/get_external_links', function (req,res) {

    console.log(tweets_data[0].text);
    var content = tweets_data[0].text;
    //regular expression for URL
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);

    var html_table = form_external_links(regex);

    console.log("Show regex");
    console.log(regex.exec(content)[0]);
    console.log(html_table);



    res.end(html_table);

});
/*
@arg1 content that might contain urls
@return well-formed html table
 */
function form_external_links(tweets_data, regex_object) {


    var url;
    var content;
    var style = " <style> table, th, td { border: 1px solid black; border-collapse: collapse;}";
    style +=" th, td { padding: 5px; text-align: left; }";
    style += "caption{ font-size: 30px; } </style> ";

    var table = '<table style="width: 100%"> <tr>';
    table += "<caption>External Links</caption>"
    table += "<th>" + "User Name" + " </th>";
    table += "<th>" + "URL" + "</th></tr>";
    var i = 0;
    console.log(tweets_data[i]);
    while(tweets_data[i] != null)
    {
        console.log("in while");
        content = tweets_data[i].text;
        url = regex_object.exec(content)[0];
        table += "<tr><th>" + tweets_data[i].user.name + " </th>";
        table += "<th>" + url + "</th></tr>";

        i++;
    }
    return style + table;



}
function form_all_known_users(tweets_data) {
    var i = 0;

    var tweets_entities;
    //well-formed css for formatting HTML table
    var style = " <style> table, th, td { border: 1px solid black; border-collapse: collapse;}";
    style +=" th, td { padding: 5px; text-align: left; }";
    style += "caption{ font-size: 30px; } </style> ";
    var table = '<table style="width: 100%"> <tr>';
    table += "<caption>All Known Users</caption>"
    table += "<th>" + "Tweeter ID" + " </th>";
    table += "<th>" + "KnownUser Name" + "</th></tr>";
    console.log(tweets_data[i] === null);
    //var flag = tweets_data[i] != null;

    while(tweets_data[i] != null)
    {
        console.log("i =" + i);
        tweets_entities = tweets_data[i].entities;
        console.log(tweets_entities.user_mentions);

        var mentioned = tweets_entities.user_mentions;
        //console.log(mentioned);
        var j = 0;
        while(mentioned[j] != null)
        {

            console.log("j =" + j);
            console.log(mentioned[j]);
            console.log("Name ->" + mentioned[j].name);
            table += "<tr><th>" + tweets_data[i].id + " </th>";
            if(mentioned[j].name != null)
            {
                table += "<th>" + mentioned[j].name + " </th>";
            }
            else
            {
                table += "<th>" + " Not Available "+ "</th>"
            }
            table += "</tr>";
            j++;
        }
        i++;
    }
    return style + table;
}
function form_detailed_users(user_info) {
    //counter for loop
    var index = 0;
    //well-formed css for formatting HTML table
    var style = " <style> table, th, td { border: 1px solid black; border-collapse: collapse;}";
    style +=" th, td { padding: 5px; text-align: left; }";
    style += "caption{ font-size: 30px; } </style> ";

    var table = '<table style="width: 100%"> <tr>';
    table += "<caption>Detailed User</caption>"
    table += "<th>" + "User ID" + " </th>";
    table += "<th>" + "User Name" + "</th>";
    table += "<th>" + "Since" + "</th>";
    table += "<th>" + "Description" + " </th>";
    table += "<th>" + "Location" + "</th></tr>";

    table += "<tr><th>" + user_info.user.id + " </th>";
    table += "<th>" + user_info.user.name + " </th>";
    table += "<th>" + user_info.user.created_at + " </th>";
    table += "<th>" + user_info.user.description + " </th>";
    table += "<th>" + user_info.user.location + " </th></tr>";


    return style + table;
}

function form_all_tweets(tweets_data){

    console.log(tweets_data);
    //counter for loop
    var index = 0;
    //well-formed css for formatting HTML table
    var style = " <style> table, th, td { border: 1px solid black; border-collapse: collapse;}";
    style +=" th, td { padding: 5px; text-align: left; }";
    style += "caption{ font-size: 30px; } </style> ";

    var table = '<table style="width: 100%"> <tr>';
    table += "<caption>All Tweets</caption>"
    table += "<th>" + "tweet'ID" + " </th>";
    table += "<th>" + "User Name" + "</th>";
    table += "<th>" + "Content" + "</th></tr>";

    while(tweets_data[index] != null)
    {
        table += "<tr><th>" + tweets_data[index].id + " </th>";
        table += "<th>" + tweets_data[index].user.name + " </th>";
        table += "<th>" + tweets_data[index].text + " </th></tr>";
        //increment index
        index++;
    }
    table += "</table>";
    return style + table;
}
/*
*
* */
function form_detailed_tweets(tweets_data) {
    var style = " <style> table, th, td { border: 1px solid black; border-collapse: collapse;}";
    style +=" th, td { padding: 5px; text-align: left; }";
    style += "caption{ font-size: 30px; } </style> ";

    var table = '<table style="width:100%"><tr>';
    table += "<caption>Detailed One Tweet</caption>"
    table += "<th>" + "tweet's ID" + " </th>";
    table += "<th>" + "User Name" + "</th>";
    table += "<th>" + "Text" + "</th>";
    table += "<th>" + "Time Zone" + "</th>";
    table += "<th>" + "Favorite Counts " + "</th> </tr>";

    table += "<tr><th>" + tweets_data.id + " </th>";
    table += "<th>" + tweets_data.user.name + " </th>";
    table += "<th>" + tweets_data.text + " </th>";
    table += "<th>" + tweets_data.user.time_zone + " </th>";
    table += "<th>" + tweets_data.user.favourites_count + " </th>";

    table += "</table>";

    return style + table;
}

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("listening at http://localhost:8000");
})


