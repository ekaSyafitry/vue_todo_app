<template>
  <div>
    <div :class="[modalActive ? 'bg-modal active' : 'bg-modal']" @click="updateAddActive()"></div>
    <form action="" @submit.prevent="addTodo()" :class="[modalActive? 'add-modal active' : 'add-modal']">
      <div style="height:100%; position:relative;" v-if="type=='edit'">
        <h2 v-if="type == 'edit'"> Edit Task</h2>
        <div v-if="dataModal.length != 0 ">
          <div>
            <label for="task" class="title-mdl"><i class="fas fa-tasks"></i>TASK</label>
            <input type="text" name="task" v-model="dataModal.name" required>
          </div>
          <div>
            <label for="note" class="title-mdl"><i class="far fa-comment"></i>NOTES</label>
            <textarea name="note" id="note" cols="30" rows="5" width="100%" v-model="dataModal.notes"></textarea>
          </div>
          <div>
            <label for="time" class="title-mdl"> <i class="far fa-calendar-alt"></i>DATE</label>
            <vuejs-datepicker calendar-class="time" wrapper-class="timeWrap" v-model="dataModal.date"
              :disabled-dates="disabledDates"></vuejs-datepicker>
          </div>
        </div>
      </div>
      <div v-if="type == 'add'">
        <h2 v-if="type == 'add'">Add Task</h2>
        <div>
          <label for="task" class="title-mdl"><i class="fas fa-tasks"></i>TASK</label>
          <input type="text" name="task" v-model="addData.name" required>
        </div>
        <div>
          <label for="note" class="title-mdl"><i class="far fa-comment"></i>NOTES</label>
          <textarea name="note" id="note" cols="30" rows="5" width="100%" v-model="addData.notes"></textarea>
        </div>
        <div>
          <label for="time" class="title-mdl"> <i class="far fa-calendar-alt"></i>DATE</label>
          <vuejs-datepicker calendar-class="time" wrapper-class="timeWrap" v-model="addData.date"
            :disabled-dates="disabledDates" format="MMM dd yyyy"></vuejs-datepicker>
        </div>
      </div>
      <div class="btn-bg"></div>
      <div class="btn-modal">
        <button><i class="fas fa-check"></i></button>
      </div>

    </form>
  </div>
</template>
<script>
  
  export default {
    name: 'modal',
    props: ['modalActive', 'dataModal', 'type'],
    data: () => ({
      disabledDates: {
         customPredictor: function(date) {
           const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (date < today) return true; 
          return false;
       }
      },
      database: firebase.database(),
      addData: {
        name: '',
        notes: '',
        date: new Date()
      }
    }),
    components: {
      vuejsDatepicker
    },
    mounted() {
    },
    methods: {
      updateAddActive() {
        this.$emit('updateModal')
      },
      submit() {
        let frmt_date = this.addData.date.getFullYear() + "-" + (this.addData.date.getMonth() + 1) + "-" + this.addData.date.getDate()
        const rootRef = this.database.ref('todolist')
        const autoId = rootRef.push().key
        rootRef.child(autoId).set({
          name: this.addData.name,
          notes: this.addData.notes,
          date: frmt_date,
          complete: false
        })
        this.$emit('updateDate', this.addData.date)
        alert('Success add data !!')
        this.addData.name = ''
        this.addData.notes = ''
        this.addData.date = new Date()
        this.$emit('updateModal')
       
      },
      addTodo() {
        if (this.type == 'edit') {
          // console.log(this.dataModal)
          let frmt_date = this.dataModal.date.getFullYear() + "-" + (this.dataModal.date.getMonth() + 1) + "-" + this.dataModal.date.getDate()
          this.database.ref('todolist').child(this.dataModal.id).update({
            name: this.dataModal.name,
            notes: this.dataModal.notes,
            date: frmt_date
          });
          this.$emit('updateDate', this.dataModal.date)
          alert('Success edit data !!')
          this.$emit('updateModal')
        } else if (this.type == 'add') {
          this.submit()
        }
      }
    }
  }
</script>