import {Card, List, Space} from "antd";
import {UnorderedListOutlined} from "@ant-design/icons";
import {Text} from "@/components/text";
import {LatestActivitiesSkeleton} from "@/components";
import {useList} from "@refinedev/core";
import {DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY, DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY} from "@/graphql/queries";
import dayjs from "dayjs";
import {CustomAvatar} from "@/components/custom-avatar";

export const LatestActivities = () => {
    const {data: audit, isLoading: isLoadingAudit, isError, error} = useList({
        resource: 'audits',
        meta: {
            gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY
        }
    })

    const dealsIds = audit?.data?.map((audit) => audit?.targetId)

    const {data: deals, isLoading: isLoadingDeals} = useList({
        resource: 'deals',
        queryOptions: {enabled: !!dealsIds?.length},
        pagination: {
            mode: 'off'
        },
        filters: [{field: 'id', operator: 'in', value: dealsIds}],
        meta: {
            gqlQuery: DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY
        }
    })

    if (isError) {
        return null;
    }

    const isLoading = isLoadingAudit || isLoadingDeals

    return (
        <div>
            <Card
                headStyle={{padding: '16px 0'}}
                bodyStyle={{padding: '0 1rem'}}
                title={(
                    <div
                        style={{display: 'flex', alignItems: 'center', gap: '8px'}}
                    >
                        <UnorderedListOutlined style={{ marginLeft: '16px' }} />
                        <Text size="sm" style={{marginLeft: '1.5rem'}}>
                            Latest activities
                        </Text>
                    </div>
                )}
            >
                {isLoading ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={Array.from({length: 5})
                            .map((_, i) => ({id: i}))}
                        renderItem={(_, index) => (
                            <LatestActivitiesSkeleton key={index}/>
                        )}

                    />
                ) : (
                    <List
                        itemLayout="horizontal"
                        dataSource={audit?.data}
                        renderItem={(item) => {
                            const deal = deals?.data.find((deal) => deal.id === String(item.targetId)) || undefined
                            return (
                                <List.Item>
                                    <List.Item.Meta
                                        title={dayjs(deal?.createAt).format('MMM DD, YYYY - HH:mm')}
                                        avatar={
                                            <CustomAvatar
                                                shape="square"
                                                size={48}
                                                src={deal?.company.avatarUrl}
                                                name={deal?.company.name}
                                            />
                                        }
                                        description={
                                            <Space size={4}>
                                                <Text strong>{item.user?.name}</Text>
                                                <Text>
                                                    {item.action === 'CREATE' ? 'created' : 'moved'}
                                                </Text>
                                                <Text strong>{deal?.title}</Text>
                                                <Text>deal</Text>
                                                <Text>{item.action === 'CREATE' ? 'in' : 'to'}</Text>
                                                <Text strong>
                                                    {deal?.stage?.title}
                                                </Text>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )
                        }}
                    />
                )}
            </Card>
        </div>
    )
}