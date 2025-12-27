from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.category_schema import CategoryResponse, CategoryCreate, CategoryUpdate
from app.services import category_service
from app.middlewares.auth_middleware import get_current_user
from app.middlewares.role_middleware import RoleChecker

router = APIRouter(prefix="/categories", tags=["Categories"])

# Anyone authenticated can read? Yes.
# Only admin can write? Let's say yes for now.

admin_only = RoleChecker(["admin"])

@router.get("/", response_model=List[CategoryResponse], dependencies=[Depends(get_current_user)])
async def read_categories():
    return await category_service.get_all_categories()

@router.get("/{cat_id}", response_model=CategoryResponse, dependencies=[Depends(get_current_user)])
async def read_category(cat_id: str):
    cat = await category_service.get_category_by_id(cat_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat

@router.post("/", response_model=CategoryResponse, dependencies=[Depends(admin_only)])
async def create_category(cat_in: CategoryCreate):
    return await category_service.create_category(cat_in)

@router.put("/{cat_id}", response_model=CategoryResponse, dependencies=[Depends(admin_only)])
async def update_category(cat_id: str, cat_in: CategoryUpdate):
    cat = await category_service.update_category(cat_id, cat_in)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat

@router.delete("/{cat_id}", dependencies=[Depends(admin_only)])
async def delete_category(cat_id: str):
    success = await category_service.delete_category(cat_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted"}
