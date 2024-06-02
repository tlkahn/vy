import { createConsumer } from '@rails/actioncable';

const consumer = createConsumer('ws://localhost:3333/cable');

const chatroomChannel = consumer.subscriptions.create('ChatroomChannel', {
  connected() {
    log.info('Connected to the chatroom!');
  },
  disconnected() {
    log.info('Disconnected from the chatroom!');
  },
  received(data) {
    log.info(data);
  },
  speak(message) {
    this.perform('speak', { message });
  },
});

export default chatroomChannel;
