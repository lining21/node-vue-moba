<template>
  <div class="about">
    <h1>{{id ? '编辑' : '新建'}}文章</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="所属分类">
        <el-select v-model="model.categories" multiple>
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item._id"
          />  
        </el-select>  
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="model.title"></el-input>  
      </el-form-item>
      <el-form-item label="详情">
        <!-- <el-input v-model="model.body"></el-input>   -->
        <vue-editor
          useCustomImageHandler 
          v-model="model.body"
          @image-added="handleImageAdded"
        >
        </vue-editor>
      </el-form-item>
      <el-form-item label="操作">
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor';
export default {
  components: {
    VueEditor
  },
  data() {
    return {
      model: {},
      categories: []
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  methods: {
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      // An example of using FormData
      // NOTE: Your key could be different such as:
      // formData.append('file', file)
      // 一般上传json数据，这里上传文件所以要提交表单数据。
      const formData = new FormData();
      formData.append("file", file);

      const res =  await this.$http.post('upload', formData);
      const url = res.data.url; // Get url from response
      // 利用光标位置，url给自己定义的文件上传
      Editor.insertEmbed(cursorLocation, "image", url);
      resetUploader();

      // await axios({
      //   url: "https://fakeapi.yoursite.com/images",
      //   method: "POST",
      //   data: formData
      // })
      //   .then(result => {
      //     let url = result.data.url; // Get url from response
      //     Editor.insertEmbed(cursorLocation, "image", url);
      //     resetUploader();
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    async save() {
      let res;
      if (this.id) {
        const res = await this.$http.put(`/rest/articles/${this.id}`, this.model)
      } else {
        const res = await this.$http.post('/rest/articles', this.model)
      }
      this.$router.push('/articles/list');
      this.$message({
        type: 'success',
        message: '保存成功'
      });
    },
    async fetch() {
      const res = await this.$http.get(`/rest/articles/${this.id}`);
      this.model = res.data;
    },
    async fetchCategories() {
      const res = await this.$http.get(`/rest/categories`);
      this.categories = res.data;
    }
  },
  created() {
      this.fetchCategories();
      this.id && this.fetch();
  }
}
</script>