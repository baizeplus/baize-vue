<template>
    <el-form>
        <el-form-item>
            <el-radio v-model='radioValue' :value ="1">
                周，允许的通配符[, - *  ]
            </el-radio>
        </el-form-item>


        <el-form-item>
            <el-radio v-model='radioValue' :value ="2">
                周期从
                <el-select clearable v-model="cycle01">
                    <el-option
                        v-for="(item,index) of weekList"
                        :key="index"
                        :label="item.value"
                        :value="item.key"
                        :disabled="item.key === 7"
                    >{{item.value}}</el-option>
                </el-select>
                -
                <el-select clearable v-model="cycle02">
                    <el-option
                        v-for="(item,index) of weekList"
                        :key="index"
                        :label="item.value"
                        :value="item.key"
                        :disabled="item.key <= cycle01"
                    >{{item.value}}</el-option>
                </el-select>
            </el-radio>
        </el-form-item>


        <el-form-item>
            <el-radio v-model='radioValue' :value ="3">
                指定
                <el-select class="multiselect" clearable v-model="checkboxList" placeholder="可多选" multiple :multiple-limit="6">
                    <el-option v-for="item in weekList" :key="item.key" :label="item.value" :value="item.key" />
                </el-select>
            </el-radio>
        </el-form-item>

    </el-form>
</template>

<script setup>
const emit = defineEmits(['update'])
const props = defineProps({
    cron: {
        type: Object,
        default: {
            min: "*",
            hour: "*",
            day: "*",
            month: "*",
            week: "*",
        }
    },
    check: {
        type: Function,
        default: () => {
        }
    }
})
const radioValue = ref(1)
const cycle01 = ref(2)
const cycle02 = ref(3)
const checkboxList = ref([])
const checkCopy = ref([2])
const weekList = ref([
    {key: 1, value: '星期日'},
    {key: 2, value: '星期一'},
    {key: 3, value: '星期二'},
    {key: 4, value: '星期三'},
    {key: 5, value: '星期四'},
    {key: 6, value: '星期五'},
    {key: 7, value: '星期六'}
])
const cycleTotal = computed(() => {
    cycle01.value = props.check(cycle01.value, 1, 6)
    cycle02.value = props.check(cycle02.value, cycle01.value + 1, 7)
    return cycle01.value + '-' + cycle02.value
})

const checkboxString = computed(() => {
    return checkboxList.value.join(',')
})
watch(() => props.cron.week, value => changeRadioValue(value))
watch([radioValue, cycleTotal, checkboxString], () => onRadioChange())
function changeRadioValue(value) {
    if (value === "*") {
        radioValue.value = 1
    } else if (value.indexOf("-") > -1) {
        const indexArr = value.split('-')
        cycle01.value = Number(indexArr[0])
        cycle02.value = Number(indexArr[1])
        radioValue.value = 2
    } else {
        checkboxList.value = [...new Set(value.split(',').map(item => Number(item)))]
        radioValue.value = 3
    }
}
function onRadioChange() {
    switch (radioValue.value) {
        case 1:
            emit('update', 'week', '*', 'week')
            break
        case 2:
            emit('update', 'week', cycleTotal.value, 'week')
            break
        case 3:
            if (checkboxList.value.length === 0) {
                checkboxList.value.push(checkCopy.value[0])
            } else {
                checkCopy.value = checkboxList.value
            }
            emit('update', 'week', checkboxString.value, 'week')
            break
    }
}
</script>

<style lang="scss" scoped>
.el-input-number--small, .el-select, .el-select--small {
    margin: 0 0.5rem;
}
.el-select, .el-select--small {
    width: 8rem;
}
.el-select.multiselect, .el-select--small.multiselect {
    width: 17.8rem;
}
</style>
