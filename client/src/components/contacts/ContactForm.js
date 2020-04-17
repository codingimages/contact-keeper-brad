import React, { useState, useContext, useEffect } from "react"
import ContactContext from "../../context/contact/contactContext"
import AlertContext from "../../context/alert/alertContext"

const ContactForm = () => {

    const contactContext = useContext(ContactContext)
    const alertContext = useContext(AlertContext)

    const { addContact, current, clearCurrent, updateContact } = contactContext
    const { setAlert } = alertContext
    // similar to component did mount, this will use the current function from contact context to fill the form blanks
    useEffect(() => {
        if (current != null) {
            setContact(current)
        } else setContact({
            name: '',
            email: '',
            phone: '',
            type: 'personal'
        })
    }, [contactContext, current])

    const [contact, setContact] = useState({
        name: '',
        email: '',
        phone: '',
        type: 'personal'
    })

    const { name, email, phone, type } = contact

    const onChange = e => setContact({
        // will bring in the state
        ...contact,
        // will match the target name and change the value in the state
        [e.target.name]: e.target.value
    })

    const onSubmit = e => {
        if (contact.name === "") {
            setAlert("Name and contact information is required", "danger")
        } else if (current === null) {
            addContact(contact);
        } else {
            updateContact(contact)
        }
        e.preventDefault()
        clearAll()
    }

    const clearAll = () => {
        clearCurrent()
    }

    return (
        <form onSubmit={onSubmit}>
            <h1 className="text-primary">{current ? "Edit contact" : "Add Contact"}</h1>
            <input
                type="text"
                placeholder="Name"
                name="name"
                value={name}
                onChange={onChange}
            />
            <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={onChange}
            />
            <input
                type="text"
                placeholder="Phone"
                name="phone"
                value={phone}
                onChange={onChange}
            />
            <h1>Contact Type</h1>

            <input
                type="radio"
                name="type"
                value="personal"
                onChange={onChange}
                checked={type === "personal"}
            /> Personal{' '}

            <input
                type="radio"
                name="type"
                value="professional"
                onChange={onChange}
                checked={type === "professional"}
            /> Professional{' '}

            <div>
                <input type="submit" value={current ? "Update Contact" : "Add Contact"} className="btn btn-primary btn-block" />
            </div>
            {current ? <button onClick={clearAll} className="btn btn-light btn-block">Clear</button> : null}

        </form>
    )
}

export default ContactForm