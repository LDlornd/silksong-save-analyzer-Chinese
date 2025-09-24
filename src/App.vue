<script setup></script>

<template>
  <el-container>
    <el-header>
      丝之歌存档解析器
    </el-header>
    <el-main>
      <el-row>
        <el-upload
    ref="upload"
          class="upload-demo"
          :limit="1"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          :auto-upload="false"
        >
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
          <el-button class="ml-3" type="success" @click="submitUpload">
            upload to server
          </el-button>
          <template #tip>
            <div class="el-upload__tip text-red">
              limit 1 file, new file will cover the old file
            </div>
          </template>
        </el-upload>
      </el-row>
      <el-row>
        <el-tabs tab-position="left" style="height: 200px" class="demo-tabs">
          <el-tab-pane v-for="value, key in acts" :label="value" :name="key">
            {{ content }}
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-main>
  </el-container>
</template>



<script setup>
import { ref } from 'vue'
import { genFileId, ElMessage } from 'element-plus'
import { decryptSaveFile } from "@/utils/decrypter.js"


const acts = {"act1": "第一幕", "act2": "第二幕", "act3": "第三幕"}

const file_content = ref(null)
const content = ref('')
const upload = ref()

const handleChange = (file) => {
  file_content.value = file.raw
}

const handleExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.hanleChange(file)
}

const submitUpload = async () => {
  if (!file_content.value) {
    ElMessage.error('请选择文件。')
    return
  }

  try {
    content.value = await decryptSaveFile(file_content.value)
  } catch (e) {
    ElMessage.error('解密失败：' + e.message)
  }
}
</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}
</style>
