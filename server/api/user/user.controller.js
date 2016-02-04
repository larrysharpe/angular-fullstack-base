'use strict';

var User = require('./user.model');
var History = require('../history/history.model');
var Transaction = require('../transaction/transaction.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var slugify = function (text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

var convertToEmail = function (input){
  var output;
  output = slugify(input);
  output += '@a.com';
  return output;
};

var validationError = function(res, err) {
  return res.json(422, err);
};

var makeRandomString = function (length){
  if(!length) length = 5;
  var text = "",
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < length; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}


/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

exports.adminHome = function(req, res) {

  var qry = User.find({}, 'username slug roles status').limit(100);
  qry.exec(function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });

};

exports.createBatch = function (req, res){

  var usernames = ['Abriana','Aira','Africa','Alabama','Alana','Alaya','Alecia','Alicia','Alex','Alexis','Alexa','Alexandra','Alexandria','Alison','Allura','Ally','Alpha','Alyssa','Amanda','Amaze','Amber','Amelia','Amethyst','Analis','Anastasia','Andra','Andrea','Andromeda','Angel','Angela','Angelique','Angie','Anise','Anisette','Anna','Annabella','Annie','Annika','Antoinette','Aphrodite','April','Ariel','Aries','Ashlee','Ashley','Ashlyn','Asia','Athena','Atlanta','Aubra','Aubrey','Audra','Aura','Aurora','Austin','Autumn','Ava','Azrael','Baby','Bailey','Bambi','Barbie','Beau','Beautiful','Becky','Bede','Belinda','Belle','Berry','Bethany','Bianca','Bindi','Bird','Bo','Bolero','Blade','Blake','Blanca','Blaze','Blondie','Blossom','Blue','Blush','Bobbie','Bordeaux','Bountiful','Brandy','Brandi','Breeze','Breezy','Brianna','Bridget','Brie','Brilliant','Brita','Britain','Brittany','Bronte','Bubbles','Buffy','Bunny','Burgundie','Butterfly','Callie','Cameo','Camille','Candi','Candice','Candy','Candee','Carmel','Carmela','Carmen','Carrie','Cashmere','Champagne','Chance','Chanel','Chantal','Chantelle','Chantilly','Chantiqua','Chaos','Charity','Charlie','Charlotte','Chastity','Cherie','Cherry','Cheyenne','China','Chloe','Chocolate','Chrissy','Christian','Christi','Lynn','Christy','Christine','Chynna','Cecilia','Cinder','Cinnamon','CJ','Cleo','Cleopatra','Clover','Coco','Cody','Constance','Contessa','Cookie','Crystal','Cuddles','Cynara','Cynder','Cyndi','Dagny','Dahlia','Daisy','Dakota','Dallas','Damiana','Dana','Danger','Danielle','Danni','Daphne','Darby','Darkness','Darla','Dawn','Decadence','Dee','Ann','Deidre','Deja','Delicious','Delight','Delilah','Delta','Deluxe','Denver','Desert','Rose','Desire','Desiree','Destiny','Devon','Devyn','Dharma','Diablo','Diamond','Diana','Dido','Diva','Divine','Divinity','Dixie','Dolly','Dominique','Dream','Duchess','Dusty','Dylan','Ebony','Echo','Ecstasy','Eden','Elan','Ella','Elle','Electra','Eli','Eliza','Elizabeth','Elvira','Elyse','Ember','Emerald','Emergency','Emily','Empress','Envy','Epiphany','Erotica','Esme','Eva','Evie','Eve','Fable','Fabulous','Faith','Fallon','Fame','Fantasia','Fantasy','Farrah','Fate','Fawn','Fawna','Fawnia','Feather','Felicia','Felicity','Felony','Ferrari','Fern','Fetish','Fiona','Fire','Francesca','Flame','Foxxxy','Frankie','Frosty','Gabrielle','Gabriella','Gaia','Gem','Gemma','Gemini','Genie','Gentle','Georgia','Gia','Giggles','Gigi','Gillian','Ginger','Giselle','Glamour','Glitter','Glory','Godiva','Grace','Gracious','Gypsy','Hanna','Harley','Harlow','Harmony','Heather','Heaven','Heavenleigh','Heavenly','Helena','Hillary','Holiday','Holly','Honey','Hope','Houston','Hyacinth','Ianna','Ice','Iesha','Illusion','Imagine','India','Indigo','Inferno','Infinity','Ireland','Irene','Isabel','Isabella','Isis','Ivory','Ivy','Izzy','Jade','Jaguar','Jamie','Janelle','Jasmine','Jasmyn','Jeanette','Jeanie','Jenna','Jenny','Jessica','Jessie','Jewel','Jewels','Jezebel','Jill','Jinx','JJ','Joetta','Joelle','Jolene','Jordan','Journey','Joy','Juicy','Julia','Julie','Juliet','June','Juno','Kaia','Kailli','Kara','Karla','Kashmir','Kat','Kathleen','Kayla','Kelli','Kenya','Karma','Kira','Kitten','Kitty','Krista','Kristen','Kristi','Krystal','Kylie','Kyra','Lace','Lacy','Lainie','Lakota','Lana','Latifah','Laura','Layla','Leah','Leather','Leggs','Leia','Leigh','Lexie','Licorice','Lightning','Lila','Lilith','Lily','Lindsey','Lisa','Lita','Liza','Logan','Lola','London','Loni','Lori','Love','Lucinda','Lucky','Lucretia','Lumina','Luna','Luscious','Luxury','Luxxie','Macy','Madeline','Madison','Magdalene','Magenta','Maggie','Magic','Magnolia','Malia','Malibu','Malice','Mandy','Manhattan','Margot','Maria','Mariah','Mariana','Marilyn','Marina','Marla','Marlena','Marti','Mary','Ann','Mary','Jane','Maxxx','May','McKenzie','Medusa','Megan','Melano','Melanie','Melinda','Melody','Melonie','Mercury','Merlot','Merlyn','Michelle','Mikhaila','Mikki','Mindee','Mindy','Mink','Mistress','Misty','Mercedes','Mercy','Midnight','Miracle','Mocha','Molly','Mona','Monaco','Monica','Monique','Montana','Morgan','Muse','Music','Mystery','Mystique','Nadia','Nanette','Nastasia','Nasty','Natalia','Natalie','Natasha','Nica','Nicole','Nikita','Nikki','Niko','Nina','Nixie','Noel','Nola','Norah','Notorious','Octavia','Olive','Olivia','Olympia','Omega','Opal','Ophelia','Paige','Pallas','Pamela','Pandemonium','Pandora','Pansy','Panther','Paradise','Paris','Passion','Paula','Peaches','Peanut','Pearl','Pebbles','Penelope','Penny','Pepper','Persephone','Petal','Peyton','Phoenix','Piper','Pisces','Pixie','Poison','Porsche','Power','Precious','Princess','Puppy','(yep.)','Queen','Quinn','Rachel','Rain','Ramona','Raven','Reba','Rebecca','Red','Renee','Rhiannon','Ria','Rio','Rita','River','Robyn','Rocki','Roma','Rose','Rosemary','Rosie','Roxanna','Roxanne','Ruby','Sable','Sabrina','Sachet','Saffron','Sage','Salome','Samantha','Sandi','Sapphire','Sarah','Sarasota','Saraya','Sasha','Sashay','Sassparilla','Sassy','Satan','Satin','Sativa','Savannah','Scandal','Scarlet','Selena','September','Septiva','Serena','Serenity','Seven','Shana','Shane','Shannon','Shawna','Shay','Shea','Shelby','Shelly','Sheree','Sherri','Sherry','Shine','Siam','Siena','Sierra','Silk','Silky','Silver','Sin','Simone','Siren','Skye','Sloane','Smoky','Soleil','Sonia','Song','Sorority','Spice','Spider','Spring','Staci','Stacia','Starr','Stevie','Storm','Stormy','Strawberry','Suavecita','Sublime','Sugar','Summer','Sundae','Sundance','Sunday','Sunni','Sunny','Sunshine','Sunset','Susanna','Suzanne','Swallow','Sweet','Sweetness','Tabitha','Taffy','Talia','Tallulah','Tamar','Tamara','Tammi','Tane','Tanya','Tara','Tasha','Tasty','Tatiana','Tawni','Taylor','Temper','Tempest','Temptation','Terra','Terror','Tess','Tessa','Texxxas','Thai','Thia','Thumper','Thyme','Tia','Tickle','Tiffany','Tiger','Tigra','Tika','Time','Tina','Tinker','Tisha','Toffee','Tommy','Toni','Topaz','Tori','Traci','Tracy','Tricia','Trinity','Trip','Tristana','Trixie','Trouble','Tuesday','Tyffany','Tyler','Tyra','Unique','Utopia','Valentina','Valentine','Vandal','Vanessa','Vanity','Velvet','Venus','Veronica','Viagra','Victoria','Victory','Viola','Violet','Viper','Virginia','Virgo','Vision','Vivienne','Vixen','Vonda','Wanda','Wednesday','Wendy','Whimsy','Whisky','Whisper','Willow','Windy','Winter','Wish','Wyndi','Xanadu','Xanthe','Xaviera','Xena','Xiola','Xtase','Yasmin','Yolanda','Yvette','Yvonne','Zena','Zenith','Zinnia','Zoe','Zoey','Zora'];
  var role = 'broadcaster';

  for (var i = 0; i<usernames.length; i++) {
    var usr = {
      email: convertToEmail(usernames[i]),
      password: "aaa",
      roles: role,
      provider: 'local',
      username: usernames[i],
      slug: slugify(usernames[i])
    }

    var newUser = new User(usr);
    newUser.save(function (err, user) {
      console.log(err);
      if (err) return validationError(res, err);
    });
  }

  res.send(200);

}

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.slug = slugify(newUser.username);
  newUser.save(function(err, user) {
    console.log(err);
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

var getCost = function (units) {
  if(units > 999) return .08;
  else return .10;
};

var getTotal = function (units) {
  return units * getCost(units);
};

exports.buyTokens = function (req, res, next) {
  var slug = req.body.slug;
  var units = Number(req.body.units);

  User.findOne({slug: slug}, function(err, user){
    if (err) return next(err);
    if (!user) return res.send(401);

    var transaction = {
      user:{
        id: user._id,
        slug: user.slug
      },
      cost: getCost(units),
      category: 'tokens',
      item: 'Add Tokens',
      units: units,
      total: getTotal(units),
      date: new Date()
    };

    var t = new Transaction(transaction);
    t.save(function(err, trans){
      if (err) console.log('Error Transaction: ',err);
      if (err) return next(err);
      if (!trans) return res.send(401);
    });

    user.credits.units = Number(user.credits.units) + units;
    user.credits.history.push(transaction);
    user.save(function(err, user){
      if (err) console.log('Error User: ',err);
      if (err) return next(err);
      if (!user) return res.send(401);
      res.json(user);
    });
  });

}

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

exports.verifyEmail = function (req, res){
  User.findOne({emailConfirmationToken: req.body.token}, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    user.emailConfirmed = true;
    user.emailConfirmationToken = '';
    user.save(function (err, user) {
      res.send(200);
    });
  });
}


exports.applyBroadcaster = function (req, res) {
  if(!req.body._id) return res.json(422, 'No user provided');
  User.findById(req.body._id, function (err, user) {
    if (user) {
      if (user.roles.indexOf('broadcaster') > -1) res.json(422, 'Broadcaster Already Approved');
      else if (user.roles.indexOf('broadcaster applicant') > -1) res.json(422, 'Broadcaster Has Already Applied');
      else {
        user.roles.push('broadcaster applicant');
        user.save(function (err) {
          res.json(200, 'OK');
        });
      }
    }
  });
}

exports.approveBroadcaster = function (req, res) {
  if(!req.body._id) return res.json(422, 'No user provided');
  User.findById(req.body._id, function (err, user) {
    if(user && user.roles.indexOf('broadcaster') > -1) res.json(422, 'Broadcaster Already Approved');
    else if(user && user.roles.indexOf('broadcaster applicant') === -1) res.json(422, 'No Broadcaster Application');
    else if(user){
      var userPermissionIndex = user.roles.indexOf('user');
      var oldPermissionIndex = user.roles.indexOf('broadcaster applicant');
      if(userPermissionIndex > -1) user.roles.splice(userPermissionIndex, 1);
      if(oldPermissionIndex > -1) user.roles.splice(oldPermissionIndex, 1);
      user.roles.push('broadcaster');
      user.save(function(err){
        res.json(200, user);
      });
    }
  });
}
exports.denyBroadcaster = function (req, res) {
  if(!req.body._id) return res.json(422, 'No user provided');
  User.findById(req.body._id, function (err, user) {
    if(user){
      var userPermissionIndex = user.roles.indexOf('user');
      var oldPermissionIndex = user.roles.indexOf('broadcaster applicant');
      if(userPermissionIndex > -1) user.roles.splice(userPermissionIndex, 1);
      if(oldPermissionIndex > -1) user.roles.splice(oldPermissionIndex, 1);
      user.roles.push('broadcaster denied');
      user.broadcasterDenialReason = req.body.broadcasterDenialReason;
      user.save(function(err){
        res.json(200, user);
      });
    }
  });
}

exports.accountHelp = function (req, res) {
  if (!req.body.email) return res.json(422, 'no email address');
  User.findOne({email: req.body.email}, function(err, user) {
    if (user) {
      var resetToken = makeRandomString(16);
      user.resetToken = {token: resetToken, date: Date.now()};
      user.save();
      res.json({resetToken: resetToken, url: '/api/users/reset', full: '/api/users/reset/' + resetToken});
    } else {
      res.json({resetError: 'Could not find user.'})
    }
  });
}

exports.changeEmail = function (req, res){
  if (!req.body._id) return res.json(422, 'no user');
  if (!req.body.email) return res.json(422, 'no email address');
  User.findById(req.body._id, function(err, user) {
    if (user) {
      if(user.email === req.body.email) {
        res.json(422,'Cannot use current email');
      } else {
        var token = makeRandomString(16);
        user.emailConfirmationToken = token;
        user.emailConfirmed = false;
        user.email = req.body.email;
        user.save(function (err, user) {
          res.json({user: user});
        });
      }
    } else {
      res.json(422, 'Could not find user.');
    }
  });
};


exports.changeProfile = function (req, res){
  if (!req.body._id) return res.json(422, 'no user');
  User.findById(req.body._id, function(err, user) {
    if (user) {
      user.username = req.body.username;
      user.save(function(err, user){
        res.json(200, {user: user});
      });
    } else {
      res.json(422, 'Could not find user.');
    }
  });
};

exports.passwordReset = function (req, res){
  User.findOne({"resetToken.token": req.body.token}, function (err, user) {
    if(err !== null) res.json({error:err});
    else if(!user) res.json({error:'User not found.'});
    else {
      user.password = req.body.password;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    }
  });
};

exports.resendVerification = function (req, res, next){
  User.findOne({_id: req.params.id}, 'emailConfirmationToken', function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.send(200);
  });
};

var returnBroadcasters = function (err, users, req, res, next) {
  if (err) return next(err);
  if (!users) return res.send(401);
  res.send(200, users);
};



exports.broadcasters = function (req,res, next) {
  User.find({roles: {$in: ['broadcaster']}}, 'status username slug', {sort: 'username', limit: 100}, function(err, broadcasters){
    return returnBroadcasters(err, broadcasters, req, res, next);
  });
};

exports.broadcastersFavorites = function (req,res, next) {
  User.findOne({ _id: req.query._id }, 'faves', function(err, user){
    User.find({_id: { $in: user.faves}}, '_id status username slug', function (err, broadcasters){
      return returnBroadcasters(err, broadcasters, req, res, next);
    });
  });
};

exports.broadcastersTrending = function (req,res, next) {
  User.find({roles: {$in: ['broadcaster']}, 'status.online': 'online', trending: true},
    'username slug status', function (err, users) { return returnBroadcasters(err, users, req, res, next);} );
};

exports.broadcastersPicks = function (req,res, next) {
  User.find({roles: {$in: ['broadcaster']}, 'status.online': 'online', picks: true},
    'username slug status', function (err, users) { return returnBroadcasters(err, users, req, res, next);} );
};

exports.broadcastersOnline = function (req,res, next) {
  User.find({roles: {$in: ['broadcaster']}, 'status.show': {$in: ['online','public']}},
    'username slug status', function (err, users) { return returnBroadcasters(err, users, req, res, next);} );
}

exports.broadcastersOffline = function (req,res, next) {
  User.find({roles: {$in: ['broadcaster']}, 'status.show': 'offline'},
    'username slug status', function (err, users) { return returnBroadcasters(err, users, req, res, next);} );
};


exports.getBroadcaster = function (req, res, next) {
  User.findOne({roles: 'broadcaster', slug: req.params.slug}, function (err, broadcaster){
    if (err) return next(err);
    if (!broadcaster) return res.send(404);

    if(req.query.addRecent === '1' && req.query.user){
      var query = {'user': req.query.user};
      var update = {$push: {"watches": {broadcaster: req.params.slug, date: new Date()}}};
      History.findOneAndUpdate(query, update, {upsert:true}, function(err, doc){
        if (err) return res.send(500, { error: err });
      });
    }

    res.send(200, broadcaster);
  });
};

exports.listFaves = function (req, res, next){
  User.findOne({_id: req.params.id}, function (err, user){
    //console.log('ERROR:' + err);
    //console.log('Faves:' + faves);
    if (err) return next(err);
    if (!user) return res.send(404);
    User.find({_id: {$in: user.faves}}, 'username slug status', function (err, faves){
      if (err) return next(err);
      if (!faves) return res.send(404);
      res.send(200, faves);
    });
  })
};

exports.setFaves = function (req, res, next){
  User.findOne({_id: req.params.id},'faves', function (err, user){
    if (err) return next(err);
    if (!user) return res.send(404);
    var i;
    for(i = 0; i<req.body.ids.length; i++){
      var index = user.faves.indexOf(req.body.ids[i]);
      if (index === -1) user.faves.push(req.body.ids[i]);
    }

    user.save(function(err, user){
      if (err) return next(err);
      if (!user) return res.send(404);
      res.send(200, user.faves);
    });
  })
};

exports.unsetFaves = function (req, res, next){
  User.findOne({_id: req.params.id, faves: {$in: req.body.ids}}, 'faves', function (err, user){
    if (err) return next(err);
    if (!user) return res.send(404);

    var i;
    for(i = 0; i<req.body.ids.length; i++){
      var index = user.faves.indexOf(req.body.ids[i]);
      if (index > -1) user.faves.splice(index, 1);
    }
    user.save(function(err, user){
      if (err) return next(err);
      if (!user) return res.send(404);
      res.send(200, user.faves);
    });

  })
};

exports.justSend = function (req, res, next){
  res.send(200);
}

exports.guest = function (req, res, next){
  res.send(200);
}
