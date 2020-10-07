<template>
    <div>
        <div :class="[completeActive? 'bg-modalComplete active' : 'bg-modalComplete']" @click="updateModal"></div>
        <div :class="[completeActive? 'modalComplete active' : 'modalComplete']">
            <div v-if="type == 'complete'">
                <div class="title" >Add to complete task?</div>
            </div>
            <div v-if="type == 'incomplete'">
                 <div class="title"> Add to incomplete task?</div>
            </div>
            <div v-if="type == 'trash'">
                 <div class="title"> Are you sure to delete data?</div>
            </div>
            <button class="btnY" @click="confirmComplete()">Yes</button> 
            <button class="btnN"
                @click="updateModal">No</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'modalConfirm',
    props: ['type', 'completeActive'],
    methods: {
        confirmComplete(){
             this.$emit('yesBtn')
        },
        updateModal(){
            this.$emit('updateM')
        }
    }
}
</script>