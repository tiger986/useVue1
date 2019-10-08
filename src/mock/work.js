import Mock from 'mockjs'

const List = []
const count = 10

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        id: '@increment',
        username: '@name()',
        title: '@title(5, 8)',
        bracket:'@integer(3,7)',
        bore:'@integer(1,3)',
        pressureUp:'@integer(1,5)',
        pressureDo:'@integer(1,10)',
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