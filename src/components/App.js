import React, { useEffect, useState } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questionsArray, setQuestionsArray] = useState([])
  const [newQuestion, setNewQuestion] = useState({})
  const [hasNewQuestion, setHasNewQuestion] = useState(false)
 
  useEffect(()=>{
    fetch('http://localhost:4000/questions')
    .then(response => response.json())
    .then(questionsData => {
      console.log(questionsData);
      setQuestionsArray(questionsData)
    })
  }, [])

  useEffect(()=>{
    if(hasNewQuestion){
      fetch('http://localhost:4000/questions',
      {
        method: 'POST',
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(newQuestion)
      })
      .then(response => response.json())
      .then(question => {
        setQuestionsArray([...questionsArray, question])
      })
      setHasNewQuestion(false)
    }
  }, [hasNewQuestion])

  function handleAddQuestion(formData) {
    const questionObject = {
      prompt: formData.prompt,
      answers: [formData.answer1, formData.answer2, formData.answer3, formData.answer4],
      correctIndex: formData.correctIndex
    }
    setNewQuestion(questionObject)
    setHasNewQuestion(true)
  }

  function handleDeleteQuestion(deletedQuestion) {
    const updatedQuestions = questionsArray.filter((question) => question.id !== deletedQuestion.id);
    setQuestionsArray(updatedQuestions);
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? <QuestionForm addQuestion={handleAddQuestion} /> : <QuestionList questions={questionsArray} onDelete={handleDeleteQuestion} />}
    </main>
  );
}

export default App;
