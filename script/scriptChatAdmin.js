window.onload = onloadFunc;
function onloadFunc() {
	setTimeout(function() { hideLoader(); }, 5000);
}
function hideLoader(){
	$('#loading').hide();
	$('cursor').css({'overflow-y':'scroll'});
}
//key
const CLIENT_ID = 'jvOsWeVGnan96ozC';
var enterName = 'Admin';
var colorValue = 'red';
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
    updateMembersDOM();
  });
  room.on('member_join', function(member) {
    members.push(member);
	addMessageToListDOM("joined the chat", member);
    updateMembersDOM();
  });
  room.on('member_leave', function(id) {
    const index = members.findIndex(member => member.id === id);
    members.splice(index, 1);
	addMessageToListDOM("left the chat", member);
    updateMembersDOM();
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
  membersCount: document.querySelector('.members-count'),
  membersList: document.querySelector('.members-list'),
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

function updateMembersDOM() {
  DOM.membersCount.innerText = `${members.length} users in room:`;
  DOM.membersList.innerHTML = '';
  members.forEach(member =>
    DOM.membersList.appendChild(createMemberElement(member))
  );
}

function createMessageElement(text, member) {
  const el = document.createElement('div');
  el.appendChild(createMemberElement(member));
  el.appendChild(document.createTextNode(text));
  /*
  if(text == "kick"){
	  text == "used command!";
		const index = members.findIndex(member => member.id === id);
		
  }
  */
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