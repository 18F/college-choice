<template>
  <v-card id="compare-schools-content" class="pa-5">

    <div>
      <span>
        Add up to 10 Schools and 10 Fields of Study to compare.
      </span>

      <div class="float-right">
        <!--<v-btn icon @click="toggleMoreInfo()">
          <v-icon v-if="showInfoText">fas fa-minus-circle</v-icon>
          <v-icon v-else>fas fa-plus-circle</v-icon>
        </v-btn> -->

        <v-btn icon @click="toggleDrawer()">
          <v-icon>fas fa-times-circle</v-icon>
        </v-btn>
      </div>
      <div style="clear: both;"></div>
    </div>

    <v-card v-if="showInfoText && fieldsOfStudy.length + schools.length == 1"
      id="compare-drawer-info"
      class="pa-4 my-4"
      rounded
      flat
      outlined
    >
      <p class="mb-0">
        <strong>You have just added your first item to compare.</strong> As you add items to compare, they will be listed here.
        When you are ready to compare, click the buttons below to go to the compare page.
      </p>
    </v-card>

    <v-card v-if="schools.length == 0 && fieldsOfStudy.length == 0"
      id="compare-drawer-info"
      class="pa-4 my-4"
      rounded
      flat
      outlined
    >
      <p class="mb-0">
        <strong>You have not selected anything to compare.</strong> Start by searching for Schools or Fields of Study to find items to compare. 
      </p>
    </v-card>

    <v-card v-if="schools.length == 10 || fieldsOfStudy.length == 10"
      id="compare-drawer-info"
      class="pa-4 my-4"
      rounded
      flat
      outlined
    >
      <p class="mb-0">
        <strong v-if="schools.length == 10">Maximum of 10 Schools reached. </strong>&nbsp;<strong v-if="fieldsOfStudy.length == 10">Maximum of 10 Fields of Study reached. </strong>   
      </p>
    </v-card>    



    <v-row class="compare-drawer-content-container mb-md-4">
      <v-col cols="12" md="6">
        <div  class="compare-drawer-section-wrapper my-4">
        <div class="compare-drawer-section-header-wrapper ml-4">
          <div class="compare-icon-wrapper d-inline-block mr-4"
               style="background: #C4DEC4 ;"
          >
            <v-icon
              class="mt-1"
              color="#122E51"
              small
            >
              fas fa-university
            </v-icon>
          </div>

          <div class="compare-drawer-section-header">
            <h3 class="title">Compare Schools</h3>
          </div>
        </div>

        <div class="my-3 pr-1 mr-1">
          <v-checkbox
            @change="handleToggleCompareItem(school,schoolKey)"
            v-for="school in schools"
            :key="school.schoolId"
            :value="school.schoolId"
            hide-details
            v-model="selectedSchools"
            color="secondary"
            class="my-5 pa-0 checkbox-list"
          >
            <template v-slot:label>
              <div class="compare-drawer-fos-checkbox-label">
                <h4>
                  {{school.schoolName}}
                </h4>
              </div>
            </template>
          </v-checkbox>

        </div>

        <!-- Medium and smaller button-->
        <div class="d-md-none mt-5 text-center">
          <v-btn
            rounded
            color="secondary"
            :href="$baseUrl+'/compare'"
          >
            Compare Schools
          </v-btn>
        </div>
      </div>
      </v-col>

      <v-col cols="12" md="6">
        <div  class="compare-drawer-section-wrapper my-4">
        <div class="compare-drawer-section-header-wrapper ml-4">
          <div class="compare-icon-wrapper d-inline-block mr-4"
               style="background: #fec005;"
          >
            <v-icon
              class="mt-1"
              color="black"
              small
            >
              fas fa-award
            </v-icon>
          </div>

          <div class="compare-drawer-section-header">
            <h3 class="title">Compare Fields of Study</h3>
          </div>
        </div>

        <div class="my-3 compare-drawer-fos-checkbox-container pr-1">
          <v-checkbox
            v-for="fieldOfStudy in fieldsOfStudy"
            @change="handleToggleCompareItem(fieldOfStudy, fieldOfStudyKey)"
            :key="generateFieldOfStudyString(fieldOfStudy)"
            hide-details
            v-model="selectedFieldsOfStudy"
            :value="generateFieldOfStudyString(fieldOfStudy)"
            color="secondary"
            class="my-5 checkbox-list"
          >
            <template v-slot:label>
              <div class="compare-drawer-fos-checkbox-label">
                <h4>{{fieldOfStudy.fosTitle | formatCip2Title}}</h4>
                <p class="mb-0 fos-uppercase-credential-title">{{fieldOfStudy.credentialTitle | formatFieldOfStudyCredentialTitle}}</p>
                <p class="mb-0 fos-school-name-text">{{fieldOfStudy.institutionName}}</p>
              </div>
            </template>
          </v-checkbox>
        </div>

        <!-- sm and smaller button-->
        <div class="d-md-none mt-5 text-center">
          <v-btn class="compare-drawer-button"
                 rounded
                 color="secondary"
                 :href="$baseUrl+'/compare/?toggle=fos'"
          >
            Compare Fields of Study
          </v-btn>
        </div>
      </div>
      </v-col>
    </v-row>

    <!-- Compare Buttons, medium or larger-->
    <div id="compare-drawer-md-button-row" v-resize="onResize" v-if="schools.length > 0 || fieldsOfStudy.length > 0">
      <v-row>
        <v-col cols="12" md="5" class="text-center d-none d-md-block" >
          <v-btn
            rounded
            color="secondary"
            :href="$baseUrl+'/compare'"
          >
            Compare Schools
          </v-btn>
        </v-col>
        <v-col cols="12" md="7" class="text-center compare-drawer-button-container d-none d-md-block">
          <v-btn class="compare-drawer-button"
                 rounded
                 color="secondary"
                 :href="$baseUrl+'/compare/?toggle=fos'"
          >
            Compare Fields of Study
          </v-btn>
        </v-col>
      </v-row>
    </div>



  </v-card>
</template>

<style lang="scss" scoped>
  @import 'sass/_variables';
  .v-input--selection-controls.v-input .v-label {
    color: #ffffff !important;
  }

  .my-3{
    margin-left:22px;
  }

  #compare-drawer-fos-container{
    min-height: 400px;
  }

  .compare-drawer-fos-title{
    @media (min-width: 960px) {
      padding-left: 12px;
    }
  }

  .compare-drawer-button-container{

  }

  .compare-drawer-fos-checkbox-container{
    @media (min-width: 960px){
      min-height: 420px;
    }
  }
  .compare-drawer-section-wrapper {
    border-left: 1px solid $light-gray;
    margin-left: -24px;
  }

  #compare-schools-content{
    overflow-y: auto;
    height: 90vh;
    border-top: 10px solid black;
    @media (min-width: 960px){
      height: 50vh;
    }

  }

  .compare-drawer-content-container{
    padding-bottom: 80px;

    @media (min-width: 960px){
      padding-bottom: 0;
    }
  }

  .compare-drawer-button{
    /*position: absolute;*/
    /*bottom: 24px;*/
  }

  .compare-drawer-fos-checkbox-label{
    h4{
      font-size: 13px;
        color:#000;
    }
    p{
      font-size: 13px;
        color:#000;
        font-family: "Montserrat","Helvetica Neue",Helvetica,arial,sans-serif !important;
      
    }

    .fos-school-name-text {
      font-family: "Public Sans", "Helvetica Neue", Helvetica, arial, sans-serif !important;
    }
    @media (min-width: 960px){
      h4{
        font-size: 16px;
          color:#000;
      }
      p{
        font-size:12px;
          color:#000;
          font-family: "Montserrat","Helvetica Neue",Helvetica,arial,sans-serif !important;
      }

      .fos-school-name-text {
        font-family: "Public Sans", "Helvetica Neue", Helvetica, arial, sans-serif !important;
      }      
    }
  }

  #compare-drawer-md-button-row{
    position: fixed;
    bottom: 0px;
  }

  #compare-drawer-info{
    background: #F7F7F7;
  }

  .compare-icon-wrapper{
    border-radius: 50%;
    box-shadow: 0px 3px 6px #00000029;
    border: white 3px solid;
    width: 36px;
    height: 36px;
    text-align: center;
  }
  .compare-drawer-section-header-wrapper{
    display: inline-table;
    h3.title {
      font-weight:bold;
    }
  }

  .compare-drawer-section-header{
    display: table-cell;
    vertical-align: middle;
  }

</style>

<script>
// This can work on any page, it just needs data passed in and events to react when school
// is toggled.
import Share from "components/vue/Share.vue";
import {localStorageKeys} from '../../vue/constants';

export default {
  components: {
    share: Share
  },
  props: {
    schools: Array,
    fieldsOfStudy:{
      type: Array
    },
    showInfoText:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedSchools: [],
      selectedFieldsOfStudy: [],
      fieldOfStudyKey: localStorageKeys.COMPARE_FOS_KEY,
      schoolKey: localStorageKeys.COMPARE_KEY,
      // showCompareInfo: false
    };
  },
  watch: {
    schools() {
      this.selectedSchools = _.map(this.schools, "schoolId");
    },
    fieldsOfStudy(){
      this.selectedFieldsOfStudy = _.map(this.fieldsOfStudy, (fieldOfStudy) => {
        return this.generateFieldOfStudyString(fieldOfStudy);
      });
    },
    // showInfoText(newValue,oldValue){
    //   this.showCompareInfo = newValue;
    // }
  },
  mounted() {
    this.selectedSchools = _.map(this.schools, "schoolId");
    this.selectedFieldsOfStudy = _.map(this.fieldsOfStudy, (fieldOfStudy) => {
      return this.generateFieldOfStudyString(fieldOfStudy);
    });

    // this.showCompareInfo = this.showInfoText;
    // this.onResize();
  },
  methods: {
    handleToggleCompareSchool(school) {
      // TODO: The fade in/out or keep unchecked.
      // Move to a local state that can be clicked again and eventually refreshed.

      this.$emit("toggle-compare-school", school);
    },
    handleToggleCompareItem(item,key) {
      // TODO: The fade in/out or keep unchecked.
      // Move to a local state that can be clicked again and eventually refreshed.
      // console.log(item);
      this.$emit("toggle-compare-school", item, key);
    },
    toggleDrawer() {
      this.$emit("close-modal");
    },
    toggleMoreInfo(){
      this.$emit("toggle-more-info");
    },
    generateFieldOfStudyString(fosObject){
      return `${fosObject.id}-${fosObject.code}-${fosObject.credentialLevel}`;
    },
    onResize(){
      // setting the width for fixed position elements
      let desiredWidth = (document.querySelector("#compare-header")) ?
        document.querySelector("#compare-header").clientWidth : null;

      if(desiredWidth != null){
        document.querySelector("#compare-drawer-md-button-row").style.width = `${desiredWidth}px`;
      }else{
        document.querySelector("#compare-drawer-md-button-row").style.width = `600px`;
      }
    }
  }
};
</script>