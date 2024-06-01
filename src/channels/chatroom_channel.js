import { createConsumer } from '@rails/actioncable';

const consumer = createConsumer('ws://localhost:3333/cable');

const chatroomChannel = consumer.subscriptions.create('ChatroomChannel', {
  connected() {
    console.log('Connected to the chatroom!');
  },
  disconnected() {
    console.log('Disconnected from the chatroom!');
  },
  received(data) {
    console.log(data);
  },
  speak(message) {
    this.perform('speak', { message });
  },
});

export default chatroomChannel;
