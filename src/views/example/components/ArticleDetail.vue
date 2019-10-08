<template>
    <div class="createPost-container">
        <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

            <sticky :class-name="'sub-navbar '+postForm.status">
                <!-- <CommentDropdown v-model="postForm.comment_disabled" />
                <PlatformDropdown v-model="postForm.platforms" />
                <SourceUrlDropdown v-model="postForm.source_uri" /> -->
                <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
                </el-button>
                <!-- <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button> -->
            </sticky>

            <div class="createPost-main-container">
                <el-row>

                    <!-- <Warning /> -->

                    <el-col :span="24">
                        <!-- <el-form-item style="margin-bottom: 40px;" prop="title">
                            <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                                标题
                            </MDinput>
                        </el-form-item> -->
                        <el-form-item style="margin-bottom: 40px; color:#666666" prop="title">
                            <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                                标题
                            </MDinput>
                        </el-form-item>

                        <!-- <div class="postInfo-container">
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label-width="45px" label="作者:" class="postInfo-container-item">
                                        <el-select v-model="postForm.author" :remote-method="getRemoteUserList" filterable remote placeholder="搜索用户">
                                            <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item" :value="item" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="10">
                                    <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
                                        <el-date-picker v-model="postForm.display_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
                                    </el-form-item>
                                </el-col>

                                <el-col :span="6">
                                    <el-form-item label-width="60px" label="重要性:" class="postInfo-container-item">
                                        <el-rate v-model="postForm.importance" :max="3" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :low-threshold="1" :high-threshold="3" style="margin-top:8px;" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div> -->
                    </el-col>
                </el-row>

                <el-form-item style="margin-bottom: 40px;" label-width="45px" label="描述:">
                    <el-input :rows="1" v-model="postForm.description" type="textarea" class="article-textarea" autosize placeholder="请输入内容" />
                    <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
                </el-form-item>
                <div style="font-size:14px;color:#606266;font-weight:700;margin-bottom:15px">封面:</div>
                <!-- <div style="margin-bottom: 40px;">
                    <Upload v-model="postForm.pic" />
                </div> -->

                <div class="crop-demo" style="margin-bottom: 40px;">
                  <img :src="postForm.pic" class="pre-img">
                  <div class="crop-demo-btn">选择图片
                    <input class="crop-input" ref="pathClear" type="file" name="image" accept="image/*" @change="setImage"/>
                  </div>
                </div>
        
                <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%" @closed="cancelCrop2()">
                  <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;">

                  </vue-cropper>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCrop">取 消</el-button>
                    <el-button type="primary" @click="sureImg()">确 定</el-button>
                  </span>
                </el-dialog>

                <div style="font-size:14px;color:#606266;font-weight:700;margin-bottom:15px">正文:</div>
                <div class="editor-container">
                    <Tinymce ref="editor" :height="400" v-model="postForm.content" />
                </div>
            </div>
        </el-form>

    </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import Upload from "@/components/Upload/singleImage4";
import MDinput from "@/components/MDinput";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { validateURL } from "@/utils/validate";
import { fetchArticle, addNews, editNews, upImg } from "@/api/article";
import { userSearch } from "@/api/remoteSearch";
import Warning from "./Warning";
import VueCropper from "vue-cropperjs";
import {
  CommentDropdown,
  PlatformDropdown,
  SourceUrlDropdown
} from "./Dropdown";

const defaultForm = {
  title: "", // 文章题目
  content: "", // 文章内容
  description: "", // 文章摘要
  userId: localStorage.getItem("userId"),
  pic: "", // 文章图片
  id: undefined,

  status: "draft",
  source_uri: "", // 文章外链
  display_time: undefined, // 前台展示时间
  platforms: ["a-platform"],
  comment_disabled: false,
  importance: 0
};

export default {
  name: "ArticleDetail",
  components: {
    Tinymce,
    MDinput,
    Upload,
    Sticky,
    Warning,
    CommentDropdown,
    PlatformDropdown,
    SourceUrlDropdown,
    VueCropper
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "为必传项",
          type: "error"
        });
        callback(new Error(rule.field + "为必传项"));
      } else {
        callback();
      }
    };
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback();
        } else {
          this.$message({
            message: "外链url填写不正确",
            type: "error"
          });
          callback(new Error("外链url填写不正确"));
        }
      } else {
        callback();
      }
    };
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        pic: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
        //source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      defaultSrc: "./static/img/img.jpg",
      fileList: [],
      imgSrc: "",
      cropImg: "",
      dialogVisible: false,
      file: null,
      st: 0,
      pic2: ""
    };
  },
  computed: {
    contentShortLength() {
      return this.postForm.description.length;
    },
    lang() {
      return this.$store.getters.language;
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);
    } else {
      this.postForm = Object.assign({}, defaultForm);
    }
  },
  methods: {
    setImage(e) {
      this.file = e.target.files[0];
      if (!this.file.type.includes("image/")) {
        return;
      }
      const reader = new FileReader();
      reader.onload = event => {
        this.dialogVisible = true;
        this.imgSrc = event.target.result;
        this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
      };
      reader.readAsDataURL(this.file);
      this.$refs.pathClear.value = "";
    },
    sureImg() {
      this.st = 1;
      let imgForm = new FormData();
      imgForm.append("file", this.file);
      upImg(imgForm).then(response => {
        if (response.data.excuCode) {
          //console.log(response.data.data);
          this.pic2 = response.data.data;
          this.dialogVisible = false;
        } else {
          this.$notify.error({
            title: "上传失败",
            message: "网络问题，请刷新重试！"
          });
        }
      });
    },
    cropImage() {
      if (this.postForm.pic) {
        this.defaultSrc = this.postForm.pic;
      }
      this.postForm.pic = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    cancelCrop() {
      this.dialogVisible = false;
      this.postForm.pic = this.defaultSrc;
    },
    cancelCrop2() {
      //console.log(this.st)
      if (!this.st) {
        this.dialogVisible = false;
        this.postForm.pic = this.defaultSrc;
      }
      this.st = 0;
    },

    fetchData(id) {
      fetchArticle({ id: id })
        .then(response => {
          this.postForm = response.data.data;
          console.log(this.postForm);
          // Just for test
          //this.postForm.title += `   Article Id:${this.postForm.id}`
          //this.postForm.description += `   Article Id:${this.postForm.id}`
          //console.log(response.data)
          // Set tagsview title
          this.setTagsViewTitle();
        })
        .catch(err => {
          console.log(err);
        });
    },
    setTagsViewTitle() {
      const title = this.lang === "zh" ? "编辑文章" : "Edit Article";
      const route = Object.assign({}, this.$route, {
        title: `${title}-${this.postForm.id}`
      });
      this.$store.dispatch("updateVisitedView", route);
    },
    submitForm() {
      //this.postForm.display_time = parseInt(this.display_time / 1000)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (!this.postForm.description) {
            this.$alert("请输入文章描述！！", "提示", {
              confirmButtonText: "确定"
              // callback: action => {
              //   this.$message({
              //     type: "info",
              //     message: `action: ${action}`
              //   });
              // }
            });
            return false;
          }
          if (!this.postForm.pic) {
            this.$alert("请上传封面！", "提示", {
              confirmButtonText: "确定"
              // callback: action => {
              //   this.$message({
              //     type: "info",
              //     message: `action: ${action}`
              //   });
              // }
            });
            return false;
          }
          if (!this.postForm.content) {
            this.$alert("请输入正文！！", "提示", {
              confirmButtonText: "确定"
              // callback: action => {
              //   this.$message({
              //     type: "info",
              //     message: `action: ${action}`
              //   });
              // }
            });
            return false;
          }
          if (this.pic2) {
            this.postForm.pic = this.pic2;
          }
          //console.log(this.postForm);
          if (this.isEdit) {
            editNews(this.postForm).then(response => {
              if (response.data.excuCode) {
                this.loading = true;
                this.$notify({
                  title: "成功",
                  message: "修改文章成功",
                  type: "success",
                  duration: 2000
                });
                this.postForm.status = "published";
                this.loading = false;
                this.$router.push({ path: this.redirect || "/example/list" });
              } else {
                this.$alert(response.data.message, "提示", {
                  confirmButtonText: "确定"
                  // callback: action => {
                  //   this.$message({
                  //     type: "info",
                  //     message: `action: ${action}`
                  //   });
                  // }
                });
              }
            });
          } else {
            addNews(this.postForm).then(response => {
              //console.log(res)
              if (response.data.excuCode) {
                this.loading = true;
                this.$notify({
                  title: "成功",
                  message: "发布文章成功",
                  type: "success",
                  duration: 2000
                });
                this.postForm.status = "published";
                this.loading = false;
                this.$router.push({ path: this.redirect || "/example/list" });
              } else {
                this.$alert(response.data.message, "提示", {
                  confirmButtonText: "确定"
                  // callback: action => {
                  //   this.$message({
                  //     type: "info",
                  //     message: `action: ${action}`
                  //   });
                  // }
                });
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    draftForm() {
      if (
        this.postForm.content.length === 0 ||
        this.postForm.title.length === 0
      ) {
        this.$message({
          message: "请填写必要的标题和内容",
          type: "warning"
        });
        return;
      }
      this.$message({
        message: "保存成功",
        type: "success",
        showClose: true,
        duration: 1000
      });
      this.postForm.status = "draft";
    },
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) return;
        this.userListOptions = response.data.items.map(v => v.name);
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
.content-title {
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
.pre-img {
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 5px;
}
.crop-demo {
  display: flex;
  align-items: flex-end;
}
.crop-demo-btn {
  position: relative;
  width: 100px;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  margin-left: 30px;
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  box-sizing: border-box;
}
.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
