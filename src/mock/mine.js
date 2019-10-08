import Mock from 'mockjs'

const List = []
const count = 10

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        id: '@increment',
        username: '@name()',
        title: '@title(5, 10)',
        timestamp: +Mock.Random.date('T'),
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