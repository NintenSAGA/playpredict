import { Flex, Spin } from 'antd'

export default function Loading() {
  return (
    <>
      <main className="w-full">
        <Flex vertical justify={'center'} style={{ alignItems: "center", height: "100vh" }}>
          <Spin tip="Loading" size="large">
          </Spin>
        </Flex>
      </main>
    </>
  )
}