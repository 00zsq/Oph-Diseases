import request from '@/utils/request'

// ai问答
export const sendMessageToAI = (question, token) => {
  return request.post('/ai/chat', 
    {
      question: question
    }, 
    {
      headers: {
        'authentication': token,
        'Content-Type': 'application/json'
      }
    })
}