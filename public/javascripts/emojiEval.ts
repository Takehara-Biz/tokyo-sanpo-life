addEventListener('load', async function () {
  console.log('onload!');
  renderEmojiEvalCountSection();
});

async function renderEmojiEvalCountSection(){
  const postIdInput = document.getElementById('postId')! as HTMLInputElement;
  const targetUrl = '/posts/' + postIdInput.value + '/emojiEvals';
  const resultHTML = await fetch(targetUrl, {
    method: 'GET'
  }).then(res => {
    console.info('[BEGIN] fetch then');
    return res.text();
  }).catch(error => {
    alert(error);
    console.error('fetch Error!!', error);
    return null;
  });
  const targetEvaludatedEmojiDiv = document.getElementById('targetEvaludatedEmojiDiv')!;
  if(resultHTML != null) {
    targetEvaludatedEmojiDiv.innerHTML = resultHTML;
  } else {
    targetEvaludatedEmojiDiv.innerHTML = 'サーバ側でエラーが発生しました。';
  }
  
  console.log('updated targetEvaludatedEmojiDiv!');
}

async function createEmojiEval(unicode){
  TslLogUtil.debug('[BEGIN] createEmojiEval ' + unicode);
  const postIdInput = document.getElementById('postId')! as HTMLInputElement;
  const targetUrl = '/posts/' + postIdInput.value + '/emojiEvals';
  await fetch(targetUrl, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: '{"unicode" : "' + unicode + '" }',
  }).then(res => {
    console.log('put OK!');
  }).catch(error => {
    console.error('error occurred!');
    console.error(error);
  });

  setTimeout((() => {
    // if it's too early, old data can be printed..
    renderEmojiEvalCountSection();
  }), 500);
};

async function deleteEmojiEval(unicode){
  TslLogUtil.debug('[BEGIN] deleteEmojiEval');
  const postIdInput = document.getElementById('postId')! as HTMLInputElement;
  const targetUrl = '/posts/' + postIdInput.value + '/emojiEvals/' + unicode;
  await fetch(targetUrl, {
    method: 'DELETE'
  }).then(res => {
    console.log('remove OK!');
  }).catch(error => {
    console.error('error occurred!');
    console.error(error);
  });
  renderEmojiEvalCountSection();
};

function deletePost() {
  if (!(confirm('本当に削除して良いですか？'))) {
    return;
  }
  const postIdInput = document.getElementById('postId')! as HTMLInputElement;
  fetch('/posts/' + postIdInput.value, {
    method: 'DELETE',
  }).then((response) => {
    setTimeout((() => {
      // if it's too early, old data can be printed..
      // @ts-ignore
      window.location = '/posts/new-list?deletedToast=true';
    }), 500);
  }).catch((error) => {
    console.error(error);
    // @ts-ignore
    window.location = '/500';
  })
}