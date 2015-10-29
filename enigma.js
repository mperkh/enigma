// Simualtion of Enigma M3 enycrption machine 
// Written by Michael Perkhofer, 2015
// https://de.wikipedia.org/wiki/Enigma_(Maschine)#Aufbau

var Enigma = function(config) {
  
  var ukw = config.ukw;
  var walzenlage = config.walzenlage;
  var ringstellung = config.ringstellung;
  var walzenpos = config.walzenpos.map(i => {return i.toLowerCase()});
  var steckbrett = config.steckbrett.map(i => {return i.toLowerCase()});
  var result = '';
  
  var alphabet = 'abcdefghijklmnopqrstuvwxyz';
  
  var walzen = {
    1: {subst: 'ekmflgdqvzntowyhxuspaibrcj', pos: 1, kerbe: 'q'},
    2: {subst: 'ajdksiruxblhwtmcqgznpyfvoe', pos: 1, kerbe: 'e'},
    3: {subst: 'bdfhjlcprtxvznyeiwgakmusqo', pos: 1, kerbe: 'v'},
    4: {subst: 'esovpzjayquirhxlnftgkdcmwb', pos: 1, kerbe: 'j'},
    5: {subst: 'vzbrgityupsdnhlxawmjqofeck', pos: 1, kerbe: 'z'},
  };

  var reflector = {
    a: 'ejmzalyxvbwfcrquontspikhgd',
    b: 'yruhqsldpxngokmiebfzcwvjat',
    c: 'fvpjiaoyedrzxwgctkuqsbnmhl'
  };

  this.pressKey = function(key) {
    result = key.toLowerCase();
    
    rotateW(walzenlage[2]);
    
    console.log(walzenlage.reduce((prev, curr) => {
      return prev + alphabet.charAt(walzen[curr].pos-1).toUpperCase()
    }, ''));
    
    processS(result);
    [2,1,0].forEach(w => processW(result, walzenlage[w], true));
    processR(result);
    [0,1,2].forEach(w => processW(result, walzenlage[w], false));
    processS(result);
    
    return result.toUpperCase()
  };

  function rotateW(w, init) {
    function rotate(w) {
      walzen[w].subst += walzen[w].subst.charAt(0);
      walzen[w].subst = walzen[w].subst.slice(1);
      if (walzen[w].pos === 26) walzen[w].pos = 0;
      walzen[w].pos += 1;
    }

    rotate(w);

    var w2 = walzen[walzenlage[2]];
    var w1 = walzen[walzenlage[1]];

    if (!init && w2.pos === alphabet.indexOf(w2.kerbe) + 2) {
      rotate(walzenlage[1]);
      return;
    }

    if (!init && w1.pos === alphabet.indexOf(w1.kerbe) + 1) {
      rotate(walzenlage[0]);
      rotate(walzenlage[1]); // Anomalie
    }
  };

  function processW(key, w, rein) {
    var pre_map;
    var map;

    if (rein) {
      pre_map = walzen[w].subst.charAt(alphabet.indexOf(key));
      map = alphabet.indexOf(pre_map) - walzen[w].pos + ringstellung[walzenlage.indexOf(w)];
      if (map < 0) map += 26;
      if (map > 26) map -= 26;
    }
    else {
      pre_map = alphabet.indexOf(key) + walzen[w].pos - ringstellung[walzenlage.indexOf(w)];
      if (pre_map < 0) pre_map += 26;
      if (pre_map >= 26) pre_map -= 26;
      map = walzen[w].subst.indexOf(alphabet.charAt(pre_map));
    }

    result = alphabet.charAt(map);
  };

  function processR(key) {
    result = reflector[ukw].charAt(alphabet.indexOf(key))
  };

  function processS(key) {
    result = key;
    steckbrett.forEach(s => {
      if (key === s.charAt(0)) {
        result = s.charAt(1);
      }
      else if (key === s.charAt(1)) {
        result = s.charAt(0);
      }
    });
  }

  // Initialization of Enigma machine

  walzenlage.forEach( (w, index)  => {
    for (i=1; i < ringstellung[index]; i++) {
      walzen[w].subst = walzen[w].subst.charAt(25) + walzen[w].subst.substr(0, 25);
    }
    for (i=0; i < alphabet.indexOf(walzenpos[index]); i++) {
      rotateW(w, true)
    }
  });

};

var config = {
  ukw: 'b',
  walzenlage: [1, 2, 3],
  ringstellung: [16, 26, 08],
  walzenpos: ['A','D','U'],
  steckbrett: ['AD', 'CN', 'ET', 'FL', 'GI', 'JV', 'KZ', 'PU', 'QY', 'WX']
}

var Machine = new Enigma(config);
var input = 'AACHENISTGERETTET'.split('');
console.log(input.map(i => Machine.pressKey(i)).join(''));
