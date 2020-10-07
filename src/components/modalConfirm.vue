<template>
    <div>
        <div :class="[completeActive? 'bg-modalComplete active' : 'bg-modalComplete']" @click="updateModal"></div>
        <div :class="[completeActive? 'modalComplete active' : 'modalComplete']">
            <div v-if="type === 'complete'">
                <div class="title" >Add to complete task?</div>
            </div>
            <div v-if="type === 'incomplete'">
                 <div class="title"> Add to incomplete task?</div>
            </div>
            <div v-if="type === 'trash'">
                 <div class="title"> Are you sure to delete data?</div>
            </div>
            <div v-if="type === 'install'">
                <div class="title"> Do you like this application?</div>
            </div>
            <div style="display:flex; justify-content:space-between;" v-if="type==='install'"> 
                <button class="btnY" @click="confirmComplete()">Download Now</button> 
                <button class="btnN" @click="updateModal">Cancel</button>
            </div>
            <div v-else>   
                <button class="btnYes" @click="confirmComplete()">Yes</button> 
                <button class="btnN" @click="updateModal">Cancel</button>
            </div>
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