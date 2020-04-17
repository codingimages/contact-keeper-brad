import React, { useContext } from "react"
import PropTypes from "prop-types"
import ContactContext from "../../context/contact/contactContext"

const ContactItem = ({ contact }) => {

    const contactContext = useContext(ContactContext)

    const { deleteContact, setCurrent, clearCurrent } = contactContext

    const { _id, name, email, phone, type } = contact

    //delete contact returning an array with contacts differing by id
    const onDelete = () => {
        deleteContact(_id)
        clearCurrent()
    }

    // pull the contact to the current state for editing
    const onEdit = () => {
        setCurrent(contact)
    }

    return (
        <div className="card bg-light">
            <h3 className="text-primary text-left mb-1">
                {name}{' '} <span style={{ float: "right" }} className={"badge " + (type === "professional" ? "badge-success" : "badge-primary")}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </h3>
            <ul>
                {email && (
                    <li> <i className="fas fa-envelope-open mr-1 mb-1"></i>
                        {email}
                    </li>
                )}

                {phone && (
                    <li> <i className="fas fa-phone mr-1 mb-2"></i>
                        {phone}
                    </li>
                )}
            </ul>
            <p>
                <button onClick={onEdit} className="btn btn-dark btn-sm">Edit</button>
                <button onClick={onDelete} className="btn btn-danger btn-sm">Delete</button>
            </p>
        </div>
    )
}

ContactItem.propTypes = {
    contact: PropTypes.object.isRequired,
}

export default ContactItem