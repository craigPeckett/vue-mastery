import EventService from "@/services/EventService"

export const namespaced = true

export const state = {
  events: [],
  eventTotal: 0,
  event: {},
  perPage: 3
}

export const mutations = {
  ADD_EVENT( state, events ) {
    state.events.push( events )
  },
  SET_EVENTS( state, events ) {
    state.events = events
  },
  SET_EVENT_TOTAL( state, eventTotal ) {
    state.eventTotal = Math.ceil( eventTotal/3 )
  },
  SET_EVENT( state, event ) {
    state.event = event
  }
}

export const actions = {
  createEvent({ commit, dispatch }, event ) {
    return EventService.postEvent( event ).then(() => {
      commit( 'ADD_EVENT', event )
      const notification = {
        type: 'success',
        message: 'Your event has been created'
      }
      dispatch('notification/add', notification, {root: true})
    }).catch( err => {
      const notification = {
        type: 'error',
        message: 'There was a problem creating your event ' + err.message
      }
      dispatch('notification/add', notification, {root: true})
      throw error
    })
  },
  fetchEvents({ commit, dispatch }, { page } ) {
    return EventService.getEvents( state.perPage, page ).then( res => {
      commit('SET_EVENTS', res.data)
      commit('SET_EVENT_TOTAL', res.headers['x-total-count'])
    }).catch( err => {
      const notification = {
        type: 'error',
        message: 'There was a problem fetching events: ' + err.message
      }
      dispatch('notification/add', notification, {root: true})
    })
  },
  fetchEvent({ commit, getters, dispatch }, id ) {
    let event = getters.getEventById( id )

    if( event ) {
      commit('SET_EVENT', event)
      return event
    } else {
      return EventService.getEvent( id ).then( res => {
        commit('SET_EVENT', res.data)
        return res.data
      }).catch( err => {
        const notification = {
          type: 'error',
          message: 'There was a problem fetching event: ' + err.message
        }
        dispatch('notification/add', notification, {root: true})
      })
    }
  }
}
export const getters = {
  getEventById: state => id => {
    return state.events.find( event => event.id === id )
  }
}
