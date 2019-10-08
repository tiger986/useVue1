import Mock from 'mockjs'

const List = []
const count = 10

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        id: '@increment',
        username: '@name()',
        identity: '矿长',
        phone: '@integer(1000003,70000000000)',
        created_at: +Mock.Random.date('T'),
    }))
}

export default {
    getList: () => {
        return {
            total: List.length,
            items: List
        }
    }
}