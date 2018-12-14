const request = require('request')
const cheerio = require('cheerio')
var url = 'https://www.bitmex.com/app/contract/XBTUSD'
var Fundingrate
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

setInterval(function(){console.log(exec())}, 3000);

async function exec(){
 Fundingrate= await getfundingrate()
RateReportEstimate()
}
function sendmailoverbought(current,predict){
    const msg = {
        to: ['chun060608@gmail.com','timlai@tokenite.co'],
        from: 'hsinyang@bu.edu',
        subject: 'Overbought',
        text: 'what!!',
        html: '<strong>'+'Current Funding Rate: '+current+'%'+'<br>'+'Next Funding Rate: '+predict+'%'+'</strong>',
      };
    console.log(msg)
    //sgMail.send(msg);
    console.log('sent')
}
function sendmailoversold(current,predict){
    const msg = {
        to: ['chun060608@gmail.com','timlai@tokenite.co'],
        from: 'hsinyang@bu.edu',
        subject: 'Oversold',
        text: 'what!!',
        html: '<strong>'+'Current Funding Rate: '+current+'%'+'<br>'+'Next Funding Rate: '+predict+'%'+'</strong>',
      };
    console.log(msg)
    sgMail.send(msg);
    console.log('sent')
}
function getfundingrate(){
    return new Promise((resolve,reject)=>{
       const currentfundingrate= request(url,(err,res,body)=>{
           const $=cheerio.load(body)
           var a=[] 
           var b=[]
        $('.trade .content ') .each(function(i, elem) {
            b.push($(this).text())
        })
        a= b[0].split(" ")
            var Currentrate=[]
            var Predictedrate=[]
            Currentrate= a[240].split('Rate')
            Currentrate=Currentrate[1].split('Funding')
            Predictedrate=a[249].split('Rate')
            Predictedrate=Predictedrate[1].split('Mark')
            Fundingrate={Currentrate:Currentrate[0],Predictedrate:Predictedrate[0]}
           resolve(Fundingrate)    
       })
})
}
function RateReportEstimate(){
    let currentfundingrate =parseFloat(Fundingrate.Currentrate) 
    let predictedfundingrate=parseFloat(Fundingrate.Predictedrate)
    if(currentfundingrate <-0.15 || predictedfundingrate<-0.1){
        sendmailoversold(currentfundingrate,predictedfundingrate)
        console.log("1")
    }
    if(currentfundingrate>0.15||predictedfundingrate>0.1)
    {
        sendmailoverbought(currentfundingrate,predictedfundingrate)
        console.log('2')
    }
else console.log('No extreme contract position')
}
