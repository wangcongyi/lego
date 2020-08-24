FROM pro-registry-vpc.cn-shenzhen.cr.aliyuncs.com/devops/node:10.16.3 as builder
ENV WORK_PATH /home/app
WORKDIR $WORK_PATH
COPY ./ $WORK_PATH/
RUN yarn config set registry https://registry.npm.taobao.org/
RUN yarn config set cache-folder /cache
RUN yarn
RUN yarn build:dev

FROM pro-registry-vpc.cn-shenzhen.cr.aliyuncs.com/devops/node:10.16.3
ENV WORK_PATH /home/app
WORKDIR $WORK_PATH
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo 'Asia/Shanghai' >/etc/timezone
EXPOSE 8080
COPY --from=builder /home/app/ /home/app/
CMD ["yarn", "server:dev"]