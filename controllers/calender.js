leconst express = require('express');
const router = express.Router();
const calendar = require("./calendar-config.js");
const User = require('../models/user');
// const MandD = require('../public/selector.js');
router.post('/year', (req, res) => {
    const year = req.body.year || 2024;
    const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
    const founduser = (req.session.user._id);
   
    res.render('calendar/year.ejs', 
        {calendar: calendar(year),
        months,
        year,
        founduser,
    });
});

router.get('/year', (req, res) => {
    const year = req.body.year || 2024;
    const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
    const founduser = (req.session.user._id);
   
    res.render('calendar/year.ejs', 
        {calendar: calendar(year),
        months,
        year,
        founduser,
    });
});



router.get('/:year/:month/:day', async (req, res) => {
    const founduser = await User.findById(req.session.user._id);
    // console.log(founduser.events[0].starttime)
    let list=[];
    const E = founduser.events;
    E.forEach(e=>list.push(Number(e.starttime.replace(`'`,'').split(':')[0])))
    console.log(E)
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

// router.put('/:year/:month/:day/:event', async (req, res) => {
//     try {
//       const currentUser = await User.findById(req.session.user._id);
//       const EEE = currentUser.events.id(req.params.event);
//       EEE.set(req.body);
//       await currentUser.save();
//       res.render("calander/event.ejs",{eventid :req.params.event});
//     } catch (error) {
//       console.log(error);
//       res.redirect('/');
//     }
// });

router.get('/:year/:month/:day/:event', (req, res) => {
    const { year,month, day } = req.params;
    res.render('calendar/edit.ejs', { year, month, day });
});

module.exports = router;
