export type Pubsub = {
    pubSubName: string;
    topic: string;
    route: string;
  };
  export const DAPR_PUB_SUB_JSON: Pubsub[] = [];
  export const DaprPubSubSubscribe = (
    route: string,
    topic: string,
  ): MethodDecorator => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      DAPR_PUB_SUB_JSON.push({
        pubSubName: 'pubsub',
        route: route,
        topic: topic,
      } as Pubsub);
  
      return descriptor;
    };
  };
  