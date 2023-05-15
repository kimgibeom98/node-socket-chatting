
let socket = io()
const messageBox = document.querySelector('#message-box');
const chat = document.querySelector('#chat')

socket.on('connect', function () {
  let name = prompt('이름을 입력해 주세요', '')

  if (!name) name = '익명'
  socket.emit('newUser', name)
})


socket.on('update', function (data) {
  const peCount = document.querySelector('.pe-count');
  const message = document.createElement('div')
  const node = document.createTextNode(`${data.name}: ${data.message}`)
  let msgChild = document.createElement('span')
  let className = ''

  switch (data.type) {
    case 'message':
      className = 'other'
      break

    case 'connect':
      className = 'connect'
      break

    case 'disconnect':
      className = 'disconnect'
      break
  }

  message.classList.add(className)
  message.appendChild(msgChild);
  msgChild.appendChild(node)
  chat.appendChild(message)
  console.log(data)
  peCount.innerHTML = data.count;

})


function send() {
  const msg = document.createElement('div')
  const msgChild = document.createElement('span')
  const node = document.createTextNode(messageBox.value)

  msg.classList.add('me')
  chat.appendChild(msg)
  msg.appendChild(msgChild)
  msgChild.appendChild(node)

  socket.emit('message', { type: 'message', message: messageBox.value })

  messageBox.value = ''
}

function enterKey() {
  if (window.event.keyCode == 13) send()
}

messageBox.focus();



