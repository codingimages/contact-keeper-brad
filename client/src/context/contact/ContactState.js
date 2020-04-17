import React, { useReducer } from "react"
import axios from "axios"
import ContactContext from "./contactContext"
import ContactReducer from "./ContactReducer"

import {
    GET_CONTACTS,
    ADD_CONTACT,
    DELETE_CONTACT,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_CONTACT,
    FILTER_CONTACTS,
    CLEAR_FILTER,
    CONTACT_ERROR,
    CLEAR_CONTACTS,
} from "../types"

const ContactState = props => {
    const initialState = {
        contacts: null,
        current: null,
        filtered: null,
        error: null,
    }

    const [state, dispatch] = useReducer(ContactReducer, initialState);

    // get contacts
    const getContacts = async () => {

        try {
            const res = await axios.get("api/contacts");
            // pass info to reducer
            dispatch({
                type: GET_CONTACTS,
                payload: res.data
            })
        } catch (error) {
            dispatch({
                type: CONTACT_ERROR,
                payload: error.response.msg
            })
        }
    }

    // add contact
    const addContact = async contact => {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        try {
            const res = await axios.post("api/contacts", contact, config);
            // pass info to reducer
            dispatch({
                type: ADD_CONTACT,
                payload: res.data
            })
        } catch (error) {
            dispatch({
                type: CONTACT_ERROR,
                payload: error.response.msg
            })
        }
    }

    // delete contact
    const deleteContact = async id => {

        try {
            await axios.delete(`api/contacts/${id}`);
            // pass info to reducer
            dispatch({
                type: DELETE_CONTACT,
                payload: id
            })
        } catch (error) {
            dispatch({
                type: CONTACT_ERROR,
                payload: error.response.msg
            })
        }
    }

    // update the contact
    const updateContact = async contact => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        try {
            const res = await axios.put(
                `api/contacts/${contact._id}`,
                contact,
                config
            );
            // pass info to reducer
            dispatch({
                type: UPDATE_CONTACT,
                payload: res.data
            })
        } catch (error) {
            dispatch({
                type: CONTACT_ERROR,
                payload: error.response.msg
            })
        }
    }

    // clear contact
    const clearContacts = () => {
        dispatch({ type: CLEAR_CONTACTS })
    }

    // set current contact
    const setCurrent = contact => {
        dispatch({
            type: SET_CURRENT,
            payload: contact
        })
    }


    // clear current contact
    const clearCurrent = () => {
        dispatch({
            type: CLEAR_CURRENT,
        })
    }

    // filter contact
    const filterContacts = (text) => {
        dispatch({
            type: FILTER_CONTACTS,
            payload: text
        })
    }

    // clear filter
    const clearFilter = () => {
        dispatch({
            type: CLEAR_FILTER,
        })
    }

    return (
        <ContactContext.Provider
            value={{
                contacts: state.contacts,
                current: state.current,
                filtered: state.filtered,
                error: state.error,
                addContact,
                deleteContact,
                setCurrent,
                clearCurrent,
                updateContact,
                filterContacts,
                clearFilter,
                getContacts,
                clearContacts
            }}
        >
            {props.children}
        </ContactContext.Provider>
    )
}

export default ContactState