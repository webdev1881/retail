<template>
  <div class="swagger-wrapper">
    <div ref="swaggerContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const swaggerContainer = ref(null)

onMounted(async () => {
  // Динамический импорт Swagger UI
  const SwaggerUIBundle = (await import('swagger-ui-dist/swagger-ui-bundle.js')).default
  const SwaggerUIStandalonePreset = (await import('swagger-ui-dist/swagger-ui-standalone-preset.js')).default

  // Импорт стилей
  await import('swagger-ui-dist/swagger-ui.css')

  const spec = {
    openapi: '3.0.3',
    info: {
      title: 'Набори номенклатури API',
      description: 'API для управління наборами номенклатури з можливістю масового додавання',
      version: '1.0.0',
      contact: {
      }
    },
    servers: [
      {
        url: '',  // Пустая строка = текущий домен (localhost с прокси)
        description: 'Development with proxy'
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Операції авторизації'
      },
      {
        name: 'SkuSet',
        description: 'Управління наборами номенклатури'
      },
      // {
      //   name: 'Add many from JSON',
      //   description: 'Масові операції'
      // },
      {
        name: 'Discount Rules',
        description: 'Управління правилами знижок'
      }
    ],
    paths: {
      '/api/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Авторизація користувача',
          description: 'Авторизація користувача в системі з отриманням сесійних cookies',
          operationId: 'login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'password'],
                  properties: {
                    username: {
                      type: 'string',
                      example: 'Yulia'
                    },
                    password: {
                      type: 'string',
                      format: 'password',
                      example: ''
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Успішна авторизація',
              headers: {
                'Set-Cookie': {
                  description: 'Сесійний токен',
                  schema: {
                    type: 'string'
                  }
                }
              }
            },
            '401': {
              description: 'Невірні облікові дані'
            }
          }
        }
      },
      '/skuSet/list': {
        post: {
          tags: ['SkuSet'],
          summary: 'Отримання списку наборів',
          description: 'Отримання списку наборів номенклатури з фільтрацією та сортуванням',
          operationId: 'getSkuSetList',
          security: [
            {
              cookieAuth: []
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    count: {
                      type: 'integer',
                      description: 'Кількість записів',
                      example: 100
                    },
                    offset: {
                      type: 'integer',
                      description: 'Зміщення для пагінації',
                      example: 0
                    },
                    filter: {
                      type: 'object',
                      description: 'Фільтр для пошуку',
                      example: {}
                    },
                    period: {
                      type: 'object',
                      description: 'Період для фільтрації',
                      example: {}
                    },
                    sort: {
                      type: 'object',
                      properties: {
                        fields: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              field: {
                                type: 'string',
                                example: 'name'
                              },
                              asc: {
                                type: 'boolean',
                                example: true
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                examples: {
                  default: {
                    summary: 'Стандартний запит',
                    value: {
                      count: 100,
                      filter: {},
                      offset: 0,
                      period: {},
                      sort: {
                        fields: [
                          {
                            field: 'name',
                            asc: true
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Список наборів успішно отримано',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/SkuSet'
                        }
                      },
                      count: {
                        type: 'integer',
                        example: 5
                      },
                      error: {
                        type: 'null'
                      }
                    }
                  },
                  examples: {
                    success: {
                      summary: 'Успішна відповідь',
                      value: {
                        data: [
                          {
                            id: 4,
                            name: 'Кулинария',
                            extCode: '0.0001',
                            posName: 'nabor128',
                            removed: false,
                            onlyProduct: false,
                            onlyFuel: false,
                            pk: 4
                          }
                        ],
                        count: 5,
                        error: null
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/skuSet/add': {
        post: {
          tags: ['SkuSet'],
          summary: 'Додати набір',
          description: 'Створення нового набору номенклатури',
          operationId: 'addSkuSet',
          security: [
            {
              cookieAuth: []
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SkuSetAddRequest'
                },
                examples: {
                  example1: {
                    summary: 'Приклад додавання набору',
                    value: {
                      id: null,
                      name: '-25% кулинария',
                      extCode: '99',
                      posName: '-25% кулинария',
                      skuType: null,
                      skus: [
                        {
                          id: '048f3196-c115-4b79-8e51-4334fe6290dc',
                          name: 'Салат Секо гострий зі скумбрією 130гр',
                          code: '42748'
                        }
                      ],
                      skuSets: [
                        {
                          id: 4
                        }
                      ],
                      skuGroups: [],
                      fuelSkus: []
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Набір успішно створено',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'integer',
                        description: 'ID створеного набору',
                        example: 765
                      },
                      error: {
                        type: 'null'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/skuSet/get': {
        post: {
          tags: ['SkuSet'],
          summary: 'Отримати набір по ID',
          description: 'Отримання детальної інформації про набір за його ID',
          operationId: 'getSkuSet',
          security: [
            {
              cookieAuth: []
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['id'],
                  properties: {
                    id: {
                      type: 'integer',
                      description: 'ID набору',
                      example: 765
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Набір успішно отримано',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        $ref: '#/components/schemas/SkuSetFull'
                      },
                      error: {
                        type: 'null'
                      }
                    }
                  },
                  examples: {
                    success: {
                      summary: 'Успішна відповідь',
                      value: {
                        data: {
                          id: 765,
                          name: '-25% кулинария',
                          extCode: '99',
                          posName: '-25% кулинария',
                          skuType: null,
                          skus: [
                            {
                              uniqId: '048f3196-c115-4b79-8e51-4334fe6290dc;0',
                              isGroup: 0,
                              id: '048f3196-c115-4b79-8e51-4334fe6290dc',
                              name: 'Салат Секо гострий зі скумбрією 130гр',
                              code: '42748'
                            }
                          ],
                          skuGroups: [],
                          skuSets: [
                            {
                              id: 4,
                              name: 'Кулинария'
                            }
                          ],
                          fuelSkus: [],
                          usages: [],
                          removed: false,
                          onlyProduct: false,
                          onlyFuel: false,
                          pk: 765
                        },
                        error: null
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/skuSet/update': {
        post: {
          tags: ['SkuSet'],
          summary: 'Оновити набір',
          description: 'Оновлення існуючого набору номенклатури',
          operationId: 'updateSkuSet',
          security: [
            {
              cookieAuth: []
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SkuSetUpdateRequest'
                },
                examples: {
                  example1: {
                    summary: 'Приклад оновлення набору',
                    value: {
                      id: 766,
                      name: '-25% кулинария',
                      skus: [
                        {
                          id: '048f3196-c115-4b79-8e51-4334fe6290dc',
                        },
                        {
                          id: '6f55b8e1-991f-4646-b972-417c70a22e6d'
                        }
                      ],
                      skuSets: [
                        {
                          id: 4,
                          name: 'Кулинария'
                        }
                      ],
                      skuGroups: [],
                      fuelSkus: []
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Набір успішно оновлено',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'null'
                      },
                      error: {
                        type: 'null'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/skuSet/bulk/add': {
        post: {
          tags: ['ADD many from JSON'],
          summary: 'Масове додавання наборів з JSON файлу',
          description: 'Додавання множини наборів з JSON файлу з налаштованим інтервалом між запитами (за замовчуванням 100мс). Завантажте JSON файл з масивом наборів для додавання.',
          operationId: 'bulkAddSkuSets',
          security: [
            {
              cookieAuth: []
            }
          ],
          parameters: [
            {
              name: 'interval',
              in: 'query',
              description: 'Інтервал між запитами в мілісекундах',
              required: false,
              schema: {
                type: 'integer',
                default: 100,
                minimum: 0,
                maximum: 5000,
                example: 100
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/SkuSetAddRequest'
                  },
                  minItems: 1,
                  maxItems: 1000
                },
                examples: {
                  bulkExample: {
                    summary: 'Приклад масового додавання',
                    value: [
                      {
                        id: null,
                        name: 'Набір 1',
                        extCode: '001',
                        posName: 'Набір 1',
                        skuType: null,
                        skus: [],
                        skuSets: [{ id: 4 }],
                        skuGroups: [],
                        fuelSkus: []
                      },
                      {
                        id: null,
                        name: 'Набір 2',
                        extCode: '002',
                        posName: 'Набір 2',
                        skuType: null,
                        skus: [],
                        skuSets: [{ id: 4 }],
                        skuGroups: [],
                        fuelSkus: []
                      },
                      {
                        id: null,
                        name: 'Набір 3',
                        extCode: '003',
                        posName: 'Набір 3',
                        skuType: null,
                        skus: [],
                        skuSets: [],
                        skuGroups: [],
                        fuelSkus: []
                      }
                    ]
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Масове додавання завершено',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      total: {
                        type: 'integer',
                        description: 'Загальна кількість запитів',
                        example: 10
                      },
                      success: {
                        type: 'integer',
                        description: 'Кількість успішно доданих наборів',
                        example: 8
                      },
                      errors: {
                        type: 'integer',
                        description: 'Кількість помилок',
                        example: 2
                      },
                      duration: {
                        type: 'integer',
                        description: 'Тривалість виконання в мілісекундах',
                        example: 1250
                      },
                      results: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            index: {
                              type: 'integer',
                              description: 'Порядковий номер'
                            },
                            name: {
                              type: 'string',
                              description: 'Назва набору'
                            },
                            extCode: {
                              type: 'string',
                              description: 'Зовнішній код'
                            },
                            success: {
                              type: 'boolean',
                              description: 'Статус виконання'
                            },
                            data: {
                              type: 'object',
                              description: 'Дані відповіді при успіху',
                              properties: {
                                data: {
                                  type: 'integer',
                                  description: 'ID створеного набору'
                                },
                                error: {
                                  type: 'null'
                                }
                              }
                            },
                            error: {
                              type: 'string',
                              description: 'Повідомлення про помилку'
                            }
                          }
                        }
                      }
                    }
                  },
                  examples: {
                    successResponse: {
                      summary: 'Успішна відповідь',
                      value: {
                        total: 3,
                        success: 3,
                        errors: 0,
                        duration: 450,
                        results: [
                          {
                            index: 1,
                            name: 'Набір 1',
                            extCode: '001',
                            success: true,
                            data: { data: 766, error: null }
                          },
                          {
                            index: 2,
                            name: 'Набір 2',
                            extCode: '002',
                            success: true,
                            data: { data: 767, error: null }
                          },
                          {
                            index: 3,
                            name: 'Набір 3',
                            extCode: '003',
                            success: true,
                            data: { data: 768, error: null }
                          }
                        ]
                      }
                    },
                    partialSuccess: {
                      summary: 'Часткова успішність',
                      value: {
                        total: 3,
                        success: 2,
                        errors: 1,
                        duration: 450,
                        results: [
                          {
                            index: 1,
                            name: 'Набір 1',
                            extCode: '001',
                            success: true,
                            data: { data: 766, error: null }
                          },
                          {
                            index: 2,
                            name: 'Набір 2',
                            extCode: '002',
                            success: false,
                            error: 'Network error'
                          },
                          {
                            index: 3,
                            name: 'Набір 3',
                            extCode: '003',
                            success: true,
                            data: { data: 768, error: null }
                          }
                        ]
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Некоректний JSON масив'
            },
            '401': {
              description: 'Не авторизований'
            }
          }
        }
      },
      '/discountRule/add': {
        post: {
          tags: ['Discount Rules'],
          summary: 'Додати правило знижки',
          description: 'Створення нового правила знижки з умовами та результатами застосування',
          operationId: 'addDiscountRule',
          security: [
            {
              cookieAuth: []
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/DiscountRuleAddRequest'
                },
                examples: {
                  example1: {
                    summary: 'Приклад правила знижки',
                    value: {
                      id: null,
                      name: 'TEST',
                      beginDate: '2025-10-05T21:00:00.000Z',
                      endDate: '2025-10-07T08:01:00.000Z',
                      status: 1,
                      operatorId: 16,
                      priority: 50,
                      schedulingMode: 0,
                      isForDcGen: false,
                      comment: '',
                      extCode: '777',
                      onlyMessageMode: 0,
                      description: null,
                      isolationLevel: 1,
                      applyMode: 2,
                      posMessage: '',
                      operatorMessage: '',
                      ruleConditions: [],
                      orderConditions: [
                        {
                          comparsionType: 0,
                          type: 5,
                          group: '0',
                          skuSetId: 615,
                          skuSetIdDesc: '"Любимая" уценка 15%',
                          excludeSkuSetId: null,
                          excludeSkuSetIdDesc: '',
                          value: '{}'
                        }
                      ],
                      resultScaleItems: [
                        {
                          comparsionType: 0,
                          type: 9,
                          results: [
                            {
                              actionSettings: null,
                              isDiscountCouponReusable: false,
                              discountCouponOperatorMessage: null,
                              discountCouponPOSMessage: null,
                              discountCouponCodeMessage: true,
                              discountCouponPeriodBegin: null,
                              discountCouponPeriodEnd: null,
                              discountCouponPeriodDays: null,
                              discountCouponPeriodHours: null,
                              discountCouponPeriodMinutes: null,
                              discountCouponPeriodType: 0,
                              discountCouponUseLimit: null,
                              expression: '',
                              fixedValue: '0.0001',
                              maxGroupsCount: null,
                              discountTimeType: 0,
                              discountValueType: 0,
                              restriction: {
                                conditions: [],
                                exceptSkuSetId: null,
                                exceptSkuSetIdDesc: '',
                                skuSetId: null,
                                skuSetIdDesc: '',
                                groupApplyMode: 0,
                                sortItemsMode: 1
                              },
                              valueType: 0
                            }
                          ],
                          value: '{"value":}'
                        }
                      ],
                      restrictions: [],
                      rulesToBlock: []
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Правило знижки успішно створено',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'integer',
                        description: 'ID створеного правила знижки',
                        example: 700
                      },
                      error: {
                        type: 'null'
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Некоректні дані'
            },
            '401': {
              description: 'Не авторизований'
            }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'session',
          description: 'Сесійний токен, отриманий після авторизації через /api/login'
        }
      },
      schemas: {
        SkuSet: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 4
            },
            name: {
              type: 'string',
              example: 'Кулинария'
            },
            extCode: {
              type: 'string',
              example: '0.0001'
            },
            posName: {
              type: 'string',
              example: 'nabor128'
            },
            removed: {
              type: 'boolean',
              example: false
            },
            onlyProduct: {
              type: 'boolean',
              example: false
            },
            onlyFuel: {
              type: 'boolean',
              example: false
            },
            pk: {
              type: 'integer',
              example: 4
            }
          }
        },
        SkuSetFull: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            name: {
              type: 'string'
            },
            extCode: {
              type: 'string'
            },
            posName: {
              type: 'string'
            },
            skuType: {
              type: 'null'
            },
            skus: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  uniqId: {
                    type: 'string'
                  },
                  isGroup: {
                    type: 'integer'
                  },
                  id: {
                    type: 'string'
                  },
                  name: {
                    type: 'string'
                  },
                  code: {
                    type: 'string'
                  }
                }
              }
            },
            skuGroups: {
              type: 'array',
              items: {
                type: 'object'
              }
            },
            skuSets: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer'
                  },
                  name: {
                    type: 'string'
                  }
                }
              }
            },
            fuelSkus: {
              type: 'array',
              items: {
                type: 'object'
              }
            },
            usages: {
              type: 'array',
              items: {
                type: 'object'
              }
            },
            removed: {
              type: 'boolean'
            },
            onlyProduct: {
              type: 'boolean'
            },
            onlyFuel: {
              type: 'boolean'
            },
            pk: {
              type: 'integer'
            }
          }
        },
        SkuSetAddRequest: {
          type: 'object',
          required: ['id', 'name'],
          properties: {
            id: {
              type: 'null',
              description: 'Завжди null при створенні'
            },
            name: {
              type: 'string',
              description: 'Назва набору',
              example: '-25% кулинария'
            },
            extCode: {
              type: 'string',
              description: 'Зовнішній код',
              example: '99'
            },
            posName: {
              type: 'string',
              description: 'Назва для POS',
              example: '-25% кулинария'
            },
            skuType: {
              type: 'null'
            },
            skus: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string'
                  },
                  name: {
                    type: 'string'
                  },
                  code: {
                    type: 'string'
                  }
                }
              }
            },
            skuSets: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer'
                  }
                }
              }
            },
            skuGroups: {
              type: 'array',
              items: {
                type: 'object'
              }
            },
            fuelSkus: {
              type: 'array',
              items: {
                type: 'object'
              }
            }
          }
        },
        SkuSetUpdateRequest: {
          type: 'object',
          required: ['id', 'name', 'skus::id'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID набору для оновлення'
            },
            name: {
              type: 'string',
              description: 'Назва набору'
            },
            extCode: {
              type: 'string',
              description: 'Зовнішній код'
            },
            posName: {
              type: 'string',
              description: 'Назва для POS'
            },
            skuType: {
              type: 'null'
            },
            skus: {
              type: 'array',
              items: {
                type: 'object',
                items: {
                  id: {
                    type: 'string',
                    description: 'Офіс-код'
                  }
                }
              }
            },
            skuSets: {
              type: 'array',
              items: {
                type: 'object'
              }
            },
            skuGroups: {
              type: 'array',
              items: {
                type: 'object'
              }
            },
            fuelSkus: {
              type: 'array',
              items: {
                type: 'object'
              }
            }
          }
        },
        DiscountRuleAddRequest: {
          type: 'object',
          required: ['id', 'name', 'beginDate', 'endDate', 'status', 'operatorId', 'priority'],
          properties: {
            id: {
              type: 'null',
              description: 'Завжди null при створенні (ID генерується сервером)'
            },
            name: {
              type: 'string',
              description: 'Назва правила знижки',
              example: 'TEST'
            },
            beginDate: {
              type: 'string',
              format: 'date-time',
              description: 'Дата та час початку дії правила',
              example: '2025-10-05T21:00:00.000Z'
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'Дата та час закінчення дії правила',
              example: '2025-10-07T08:01:00.000Z'
            },
            status: {
              type: 'integer',
              description: 'Статус правила (0 - неактивне, 1 - активне)',
              enum: [0, 1],
              example: 1
            },
            operatorId: {
              type: 'integer',
              description: 'ID оператора, який створив правило',
              example: 16
            },
            priority: {
              type: 'integer',
              description: 'Пріоритет застосування правила (0-100)',
              minimum: 0,
              maximum: 100,
              example: 50
            },
            schedulingMode: {
              type: 'integer',
              description: 'Режим планування застосування правила',
              example: 0
            },
            isForDcGen: {
              type: 'boolean',
              description: 'Чи призначено для генерації дисконтних купонів',
              example: false
            },
            comment: {
              type: 'string',
              description: 'Коментар до правила',
              example: ''
            },
            extCode: {
              type: 'string',
              nullable: true,
              description: 'Зовнішній код для інтеграції',
              example: null
            },
            onlyMessageMode: {
              type: 'integer',
              description: 'Режим лише повідомлення (без застосування знижки)',
              example: 0
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Детальний опис правила',
              example: null
            },
            isolationLevel: {
              type: 'integer',
              description: 'Рівень ізоляції правила (1 - стандартний)',
              example: 1
            },
            applyMode: {
              type: 'integer',
              description: 'Режим застосування знижки (0 - автоматично, 1 - вручну, 2 - змішаний)',
              enum: [0, 1, 2],
              example: 2
            },
            posMessage: {
              type: 'string',
              description: 'Повідомлення для відображення на POS-терміналі',
              example: ''
            },
            operatorMessage: {
              type: 'string',
              description: 'Повідомлення для оператора',
              example: ''
            },
            ruleConditions: {
              type: 'array',
              description: 'Додаткові умови застосування правила',
              items: {
                type: 'object'
              },
              example: []
            },
            orderConditions: {
              type: 'array',
              description: 'Умови замовлення для застосування знижки',
              items: {
                type: 'object',
                properties: {
                  comparsionType: {
                    type: 'integer',
                    description: 'Тип порівняння'
                  },
                  type: {
                    type: 'integer',
                    description: 'Тип умови'
                  },
                  group: {
                    type: 'string',
                    description: 'Група умов'
                  },
                  skuSetId: {
                    type: 'integer',
                    description: 'ID набору номенклатури для застосування'
                  },
                  skuSetIdDesc: {
                    type: 'string',
                    description: 'Опис набору номенклатури'
                  },
                  excludeSkuSetId: {
                    type: 'integer',
                    nullable: true,
                    description: 'ID набору для виключення'
                  },
                  excludeSkuSetIdDesc: {
                    type: 'string',
                    description: 'Опис набору для виключення'
                  },
                  value: {
                    type: 'string',
                    description: 'Значення умови у форматі JSON'
                  }
                }
              }
            },
            resultScaleItems: {
              type: 'array',
              description: 'Шкала результатів застосування знижки',
              items: {
                type: 'object',
                properties: {
                  comparsionType: {
                    type: 'integer',
                    description: 'Тип порівняння для результату'
                  },
                  type: {
                    type: 'integer',
                    description: 'Тип результату'
                  },
                  results: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        actionSettings: {
                          type: 'object',
                          nullable: true,
                          description: 'Налаштування дії'
                        },
                        isDiscountCouponReusable: {
                          type: 'boolean',
                          description: 'Чи можна повторно використовувати купон'
                        },
                        discountCouponOperatorMessage: {
                          type: 'string',
                          nullable: true,
                          description: 'Повідомлення оператору про купон'
                        },
                        discountCouponPOSMessage: {
                          type: 'string',
                          nullable: true,
                          description: 'Повідомлення на POS про купон'
                        },
                        discountCouponCodeMessage: {
                          type: 'boolean',
                          description: 'Показувати код купона в повідомленні'
                        },
                        discountCouponPeriodBegin: {
                          type: 'string',
                          nullable: true,
                          format: 'date-time',
                          description: 'Початок періоду дії купона'
                        },
                        discountCouponPeriodEnd: {
                          type: 'string',
                          nullable: true,
                          format: 'date-time',
                          description: 'Закінчення періоду дії купона'
                        },
                        discountCouponPeriodDays: {
                          type: 'integer',
                          nullable: true,
                          description: 'Тривалість купона в днях'
                        },
                        discountCouponPeriodHours: {
                          type: 'integer',
                          nullable: true,
                          description: 'Тривалість купона в годинах'
                        },
                        discountCouponPeriodMinutes: {
                          type: 'integer',
                          nullable: true,
                          description: 'Тривалість купона в хвилинах'
                        },
                        discountCouponPeriodType: {
                          type: 'integer',
                          description: 'Тип періоду дії купона'
                        },
                        discountCouponUseLimit: {
                          type: 'integer',
                          nullable: true,
                          description: 'Ліміт використання купона'
                        },
                        expression: {
                          type: 'string',
                          description: 'Вираз для обчислення знижки'
                        },
                        fixedValue: {
                          type: 'string',
                          description: 'Фіксоване значення знижки',
                          example: '0.0001'
                        },
                        maxGroupsCount: {
                          type: 'integer',
                          nullable: true,
                          description: 'Максимальна кількість груп для застосування'
                        },
                        discountTimeType: {
                          type: 'integer',
                          description: 'Тип часу знижки (0 - без обмежень)'
                        },
                        discountValueType: {
                          type: 'integer',
                          description: 'Тип значення знижки (0 - фіксована сума, 1 - відсоток)'
                        },
                        restriction: {
                          type: 'object',
                          description: 'Обмеження застосування знижки',
                          properties: {
                            conditions: {
                              type: 'array',
                              description: 'Додаткові умови обмеження'
                            },
                            exceptSkuSetId: {
                              type: 'integer',
                              nullable: true,
                              description: 'ID набору для виключення'
                            },
                            exceptSkuSetIdDesc: {
                              type: 'string',
                              description: 'Опис набору для виключення'
                            },
                            skuSetId: {
                              type: 'integer',
                              nullable: true,
                              description: 'ID набору для застосування'
                            },
                            skuSetIdDesc: {
                              type: 'string',
                              description: 'Опис набору для застосування'
                            },
                            groupApplyMode: {
                              type: 'integer',
                              description: 'Режим застосування до групи'
                            },
                            sortItemsMode: {
                              type: 'integer',
                              description: 'Режим сортування товарів'
                            }
                          }
                        },
                        valueType: {
                          type: 'integer',
                          description: 'Тип значення результату'
                        }
                      }
                    }
                  },
                  value: {
                    type: 'string',
                    description: 'Значення шкали у форматі JSON'
                  }
                }
              }
            },
            restrictions: {
              type: 'array',
              description: 'Загальні обмеження правила',
              items: {
                type: 'object'
              },
              example: []
            },
            rulesToBlock: {
              type: 'array',
              description: 'Список ID правил, які блокуються цим правилом',
              items: {
                type: 'integer'
              },
              example: []
            }
          }
        }
      }
    }
  }

  SwaggerUIBundle({
    spec: spec,
    domNode: swaggerContainer.value,
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: 'StandaloneLayout',
    requestInterceptor: (request) => {
      request.credentials = 'include'
      return request
    }
  })
})
</script>

<style>
@import 'swagger-ui-dist/swagger-ui.css';

.swagger-wrapper {
  width: 100%;
  min-height: 100vh;
  background: #fafafa;
}

/* Кастомизация стилей Swagger UI */
:deep(.swagger-ui .topbar) {
  background-color: #667eea;
}

:deep(.swagger-ui .info .title) {
  color: #2d3748;
}

:deep(.swagger-ui .opblock-tag) {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
}

:deep(.swagger-ui .opblock.opblock-post) {
  border-color: #48bb78;
  background: rgba(72, 187, 120, 0.05);
}

:deep(.swagger-ui .opblock.opblock-post .opblock-summary-method) {
  background: #48bb78;
}

:deep(.swagger-ui .btn.execute) {
  background-color: #667eea;
  border-color: #667eea;
}

:deep(.swagger-ui .btn.execute:hover) {
  background-color: #5568d3;
  border-color: #5568d3;
}
</style>