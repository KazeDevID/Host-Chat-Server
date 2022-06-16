window.onload = onloadFunc;
function onloadFunc() {
	//Welcome
	prepareClose();
	setTimeout(function() { hideLoader(); }, 5000);
}
function prepareClose(){
	document.getElementById('closeButton').addEventListener('click', function(e) {
		e.preventDefault();
		this.parentNode.style.display = 'none';
	}, false);
}
function hideLoader(){
	$('#loading').hide();
	$('cursor').css({'overflow-y':'scroll'});
}
//key
const CLIENT_ID = 'jvOsWeVGnan96ozC';
var enterName = localStorage.getItem('enterName');
var colorValue = localStorage.getItem('colorValue');
//alert("Your name is: " + enterName);
//alert("Your color is: " + colorValue);
const drone = new ScaleDrone(CLIENT_ID, {
  data: {
    //name: getRandomName(),
	//name: askName(),
    //color: getRandomColor(),
	name: enterName,
	color: colorValue,
  },
});

let members = [];

drone.on('open', error => {
  if (error) {
    return console.error(error);
  }
  console.log('Successfully connected to Scaledrone');
  const room = drone.subscribe('observable-room');
  room.on('open', error => {
    if (error) {
      return console.error(error);
    }
    console.log('Successfully joined room');
  });
  room.on('members', m => {
    members = m;
    //updateMembersDOM();
  });
  room.on('member_join', member => {
    members.push(member);
	addMessageToListDOM("joined the chat", member);  
	//updateMembersDOM();
  });
  room.on('member_leave', function(member) {
	addMessageToListDOM("left the chat", member);
  });
  room.on('data', (text, member) => {
    if (member) {
      addMessageToListDOM(text, member);
    } else {
      // Message is from server
    }
  });
});
drone.on('close', event => {
  console.log('Connection was closed', event);
});
drone.on('error', error => {
  console.error(error);
});
const DOM = {
  messages: document.querySelector('.messages'),
  input: document.querySelector('.message-form__input'),
  form: document.querySelector('.message-form'),
};
DOM.form.addEventListener('submit', sendMessage);
function sendMessage() {
  const value = DOM.input.value;
  if (value === '') {
    return;
  }
  DOM.input.value = '';
  drone.publish({
    room: 'observable-room',
    message: value,
  });
}
function createMemberElement(member) {
  const { name, color } = member.clientData;
  const el = document.createElement('div');
  el.appendChild(document.createTextNode(name));
  el.className = 'member';
  el.style.color = color;
  return el;
}
function createMessageElement(text, member) {
  const el = document.createElement('div');
  el.appendChild(createMemberElement(member));
  el.appendChild(document.createTextNode(text));
  el.className = 'message';
  return el;
}
function addMessageToListDOM(text, member) {
  const el = DOM.messages;
  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  el.appendChild(createMessageElement(text, member));
  if (wasTop) {
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }
}
