<template>
  <el-container>
    <el-header>
      <h1>丝之歌全收集查缺补漏</h1>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-upload
            ref="upload"
            class="upload-demo"
            :limit="1"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :auto-upload="false"
          >
            <template #trigger >
              <el-button type="primary">选择文件进行分析</el-button>
            </template>
          </el-upload>
        </el-col>
        <el-col :span="19">
          请先选择存档，一般而言，对于 Windows 用户，存档文件位于 C:\Users\<你的用户名>\AppData\LocalLow\Team Cherry\Hollow Knight Silksong 文件夹下
        </el-col>
      </el-row>
      <el-row>
        <el-tabs tab-position="left" class="demo-tabs" style="width: 100%;">
          <el-tab-pane v-for="value, key in acts" :label="value" :name="key">
            <el-collapse style="width: 100%;">
              <el-collapse-item v-for="catgory, catgory_name in render_data[key]" :title="catgory.Chinese_name" :name="catgory_name">
                {{ catgory.description }}
                <el-table :data="catgory.items" border style="width: 100%" :row-class-name="tableRowClassName">
                  <el-table-column prop="Chinese_name" label="名称" width="180" />
                  <el-table-column prop="IsUnlocked" label="解锁状态" width="180"/>
                  <el-table-column prop="prereqs" label="前置" width="360"/>
                  <el-table-column prop="location" label="获取地点" />
                </el-table>
              </el-collapse-item>
            </el-collapse>
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
import { render } from "@/utils/render.js"


const acts = {"act1": "第一幕", "act2": "第二幕", "act3": "第三幕"}

const file_content = ref(null)
const render_data = ref('')
const upload = ref()

const handleChange = (file) => {
  file_content.value = file.raw
  analyse()
}

const handleExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.hanleChange(file)
}

const analyse = async () => {
  if (!file_content.value) {
    ElMessage.error('请选择文件。')
    return
  }

  const user_save = await decryptSaveFile(file_content.value)
  render_data.value = render(user_save)
  render_data.value['act1'] = render_data.value[1]
  render_data.value['act2'] = render_data.value[2]
  render_data.value['act3'] = render_data.value[3]
  console.log("render_data: ", render_data)
}

const tableRowClassName = ({row, row_index}) => {
  console.log("row: ", row)
  if (row.IsUnlocked == "已解锁") {
    return "unlocked-row";
  } else {
    return "locked-row";
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

.el-table .unlocked-row {
  --el-table-tr-bg-color: rgb(133, 206, 97);
}
.el-table .locked-row {
  --el-table-tr-bg-color: rgb(247, 137, 137);
}
</style>
