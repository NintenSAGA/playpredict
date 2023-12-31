import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import { Button, ConfigProvider, Flex, Layout, Menu } from 'antd'
import theme from "@/theme/themeConfig";
import React from "react";
import { Content, Header } from "antd/es/layout/layout";
import Link from "next/link";
import Search from 'antd/es/input/Search'
import { SearchBar } from '@/lib/components/SearchBar'
import { SearchOutlined } from '@ant-design/icons'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlayPredict",
  description: "Predict you play time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <ConfigProvider theme={theme}>
            <Layout
              className="layout"
              style={{ minHeight: "100%", minWidth: "100%" }}
            >
              <Header
                style={{
                  position: "fixed",
                  top: 0,
                  zIndex: 1,
                  width: "100vw",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "white",
                  boxShadow: "0px .5px 7px gray",
                }}
              >
                <Flex gap={'middle'} justify={'flex-start'} align={'center'}>
                  <Link href={"/"}>
                    <h1 className="text-3xl font-bold tracking-tight text-violet-400 mr-5">
                      PlayPredict
                    </h1>
                  </Link>
                  <SearchBar/>
                </Flex>
              </Header>
              <Content
                style={{
                  height: "100%",
                  marginTop: "10vh",
                  marginBottom: "10vh",
                  width: "100vw",
                  paddingLeft: "5vw",
                }}
              >
                {children}
              </Content>
            </Layout>
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
