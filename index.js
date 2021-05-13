const http = require ('http');
const fs = require ('fs');
var requests = require ('requests');
const homeFile=fs.readFileSync("home.html","utf-8");
const replaceVal = (tempval,orgval) => {
    let temperature=tempval.replace("{%tempval%}",(orgval.main.temp-273).toFixed(2));
    temperature=temperature.replace("{%location%}",orgval.name);
    temperature=temperature.replace("{%country%}",orgval.sys.country);
    temperature=temperature.replace("{%mintemp%}",(orgval.main.temp_min-273).toFixed(2));
    temperature=temperature.replace("{%maxtemp%}",(orgval.main.temp_max-273).toFixed(2));
    temperature=temperature.replace("{%tempstatus%}",orgval.weather[0].main);
    return temperature;
}
const server=http.createServer((req,res)=>{
    if(req.url=='/'){
        requests("http://api.openweathermap.org/data/2.5/weather?q=leh&appid=cf3e7a4031eb0eb56e67dbafe5f01994")
        .on('data',(chunk) => {
        const objData=JSON.parse(chunk);
        const arrData=[objData];
        const realTimeData=arrData.map((val) => {
            return replaceVal(homeFile,val);
        }).join('');
        res.write(realTimeData);
        })
       .on('end', function (err) {
       if (err) return console.log('connection closed due to errors', err);
        res.end();
       });
    }
})
server.listen(3001,"127.0.0.1");
