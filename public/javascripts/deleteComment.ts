async function deleteComment(commentId: string){
  if(!confirm('本当にコメントを削除して、よろしいですか？')){
    return;
  }
  
  TslLogUtil.debug('[BEGIN] deleteComment');
  const postIdInput = document.getElementById('postId')! as HTMLInputElement;
  const targetUrl = '/posts/' + postIdInput.value + '/comments/' + commentId;
  await fetch(targetUrl, {
    method: 'DELETE'
  }).then(res => {
    console.log('delete OK!');
  }).catch(error => {
    console.error('error occurred!');
    console.error(error);
  });
  window.location.reload();
};