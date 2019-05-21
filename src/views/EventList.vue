<template>
  <div class="">
    <h1>Events for {{ user.user.name }}</h1>
    <EventCard v-for='event in event.events' :key='event.id' :event='event'/>
    <template v-if='page != 1'>
      <router-link :to="{ name: 'event-list', query: {page: page -1} }" rel='prev'>Prev Page</router-link> |
    </template>
    <template v-if='page != hasNextPage'>
      <router-link :to="{ name: 'event-list', query: {page: page +1 } }" rel='next'>Next Page</router-link>
    </template>
  </div>
</template>

<script>
import EventCard from '@/components/EventCard'
import { mapState } from 'vuex'
import store from '@/store/store'

export default {
  components: {
    EventCard
  },
  beforeRouteEnter( routeTo, routeFrom, next ) {
    const currentPage = parseInt( routeTo.query.page) || 1
    store.dispatch( 'event/fetchEvents', {
      page: currentPage
    }).then(() => {
      routeTo.params.page = currentPage
      next()
    })
  }
  created() {
    this.$
  },
  computed: {
    hasNextPage() {
      return this.event.eventTotal
    },
    ...mapState(['event', 'user']),
  }
}
</script>

<style>
</style>
