import nodemailer from 'nodemailer';
export default async function Helper(req,res){
    if(req.method==="POST")
    {
        const {email,help} = req.body;
        const transport  = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.Gmail,
            pass:process.env.Password
        }
    })
    try{
       await transport.sendMail({
        to:process.env.Gmail,
        from:process.env.Gmail,
        subject:`A Request From InoByte`,
        text:`From: ${email}. Request: ${help}`
        })
       await transport.sendMail({
        to:email,
        from:process.env.CompanyGmail,
        subject:`Hi ${email}! Your Request was Sent to InoByte`,
        text:` Please wait for our response. Thanks for your Patience!`
       })
       console.log("Email Sent");
       res.status(201).end();
    }
    catch(err){
        res.status(500).end();
        console.log(err)
    }

    }
}