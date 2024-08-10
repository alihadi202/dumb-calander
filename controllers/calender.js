const express = require('express');
const router = express.Router();
const calendar = require("./calendar-config.js");
const User = require('../models/user');



router.post('/year',async (req, res) => {
  const year = req.body.year || 2024;
  const months = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];
  const founduserid = (req.session.user._id);
  const founduser = await User.findById(founduserid);
  const E = founduser.events
  


  res.render('calendar/year.ejs', 
      {calendar: calendar(year),
      months,
      year,
      founduserid,
      E,
      
  });
});

router.get('/year',async (req, res) => {
    const year = req.body.year || 2024;
    const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
    const founduserid = (req.session.user._id);
    const founduser = await User.findById(founduserid);
    const E = founduser.events
    


    res.render('calendar/year.ejs', 
        {calendar: calendar(year),
        months,
        year,
        founduserid,
        E,
        
    });
});



router.get('/:year/:month/:day', async (req, res) => {
    const founduser = await User.findById(req.session.user._id);
    let list=[];
    let listMinute=[]
    const E = founduser.events;
    E.forEach(e=>{
      const H =Number(e.starttime.replace(`'`,'').split(':')[0])
      const M =Number(e.starttime.replace(`'`,'').split(':')[1])
      list.push(H);
      listMinute.push(M);
    })
    console.log(list+'/////// '+listMinute)
    const { year,month, day } = req.params;
    res.render('calendar/day.ejs', { year, month, day ,list, E });
});

router.get('/:year/:month/:day/event', (req, res) => {
    const { year,month, day } = req.params;
    res.render('calendar/event.ejs', { year, month, day });
});

router.post('/:year/:month/:day/event', async (req, res) => {
    try {
        const founduser = await User.findById(req.session.user._id);
        console.log(founduser)
        const {label , starttime , endtime , description }=req.body
        await founduser.events.push({
          label ,
          starttime ,
          endtime,
          description,
          year : req.params.year,
          month : req.params.month,
          day : req.params.day,
  
      });
      await founduser.save();
        res.redirect(`../../../year`);
      } catch (err) {
        console.error(err);
    
        res.redirect(404);
      }
});

router.put('/:year/:month/:day/:event', async (req, res) => {
    try {
        const founduser = await User.findById(req.session.user._id);
        const E = founduser.events;
        let eve ={}
        E.forEach(e =>{
            if(e._id == req.params.event){
                eve=e
    
        }})
      eve.set(req.body);

      await founduser.save();
      res.redirect(`../../../year`);
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
});

router.get('/:year/:month/:day/:event',async (req, res) => {
    const { year,month, day , event } = req.params;
    const founduser = await User.findById(req.session.user._id);
    const E = founduser.events;
    let eve ={}
    E.forEach(e =>{
        if(e._id == req.params.event){
            eve=e

    }})
    console.log(eve);
    
    res.render('calendar/edit.ejs', { year, month, day , event , eve });
});

router.delete('/:year/:month/:day/:event', async (req, res) => {
    try {
        const founduser = await User.findById(req.session.user._id);
        const E = founduser.events;
        let eve ={}
        E.forEach(e =>{
            if(e._id == req.params.event){
                eve=e
    
        }})
      founduser.events.id(req.params.event).deleteOne();

      await founduser.save();
      res.redirect(`../../../year`);
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
});



module.exports = router;
