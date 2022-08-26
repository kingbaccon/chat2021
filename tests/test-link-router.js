const express = require('express');
const router = express.Router();

router.get('/', (_req, res) => {
  const testLinks = [];
  testLinks.push('/api/messages');
  testLinks.push('/api/messages/1');
  testLinks.push('/api/messages/404');
  testLinks.push('/api/messages/text');
  testLinks.push('/api/messages?tag=Programming');
  testLinks.push('/api/messages?tag=Hobbies');
  testLinks.push('/api/messages?tag=Programming');
  testLinks.push('/api/messages?tag=Hobbies&subject=Football');
  testLinks.push('/api/messages?tag=Hobbies&subject=Football-123');
  testLinks.push('/api/messages?wrongprop=Hobbies');

  // send a simple html - homepage to use links
  res.write(`<h1>Messages test links</h1>`);
  for (const testlink of testLinks) {
    res.write(`<li><a href='${testlink}' >${testlink}</a></li>`);
  }
  res.status(200).send();
});

module.exports = router;
