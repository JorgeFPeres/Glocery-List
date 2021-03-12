import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () => {
  let list = localStorage.getItem('list')
  if (list) {
    return JSON.parse(localStorage.getItem('list'))
  } else {
    return []
  }
}
function App() {
  const [list, setList] = useState(getLocalStorage())
  const [items, setItems] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editID, setEditID] = useState(null)
  const [alert, setAlert] = useState({ show: false, mgs: '', type: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!items) {
      showAlert(true, 'Please enter the value', 'danger')
    } else if (items && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: items }
          }
          return item
        })
      )
      setIsEditing(false)
      setEditID(null)
      setItems('')
      showAlert(true, 'Value changed', 'success')
    } else {
      let newItems = { title: items, id: new Date().getTime().toString() }
      setList([...list, newItems])
      setItems('')
      setAlert(true)
      showAlert(true, 'Item Added To The List', 'success')
    }
  }
  const showAlert = (show = false, msg = '', type = '') => {
    setAlert({ show, msg, type })
  }
  const deleteItem = (id) => {
    const newList = list.filter((del) => del.id !== id)
    setList(newList)
    showAlert(true, 'Delete Item', 'danger')
  }

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id)
    setIsEditing(true)
    setEditID(id)
    setItems(specificItem.title)
  }
  const clearList = () => {
    setList([])
    showAlert(true, 'Empty List', 'danger')
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  return (
    <>
      <section className='section-center'>
        <form className='grocery-form'>
          {alert.show && <Alert list={list} {...alert} showAlert={showAlert} />}
          <h3>grocery bud</h3>
          <div className='form-control'>
            <input
              type='text'
              className='grocery'
              placeholder='e.g. eggs'
              value={items}
              onChange={(e) => setItems(e.target.value)}
            />
            <button type='submit' className='submit-btn' onClick={handleSubmit}>
              {isEditing ? 'edit' : 'submit'}
            </button>
          </div>
          <div className='grocery-container'>
            <div className='grocery-list'>
              {list.map((list) => {
                return (
                  <List
                    key={list.id}
                    deleteItem={deleteItem}
                    editItem={editItem}
                    {...list}
                  />
                )
              })}
            </div>
            {list.length > 0 && (
              <button className='clear-btn' onClick={clearList}>
                clear items
              </button>
            )}
          </div>
        </form>
      </section>
    </>
  )
}

export default App
